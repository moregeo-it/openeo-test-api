import API from '../utils/API.js';
import Utils from '../utils/utils.js';
import Errors from '../utils/errors.js';
import exampleItems from '../../storage/collectionItems.js';

export default class Data {

	constructor(context) {
		this.context = context;
		this.catalog = context.collections();

		this.geeSourceCatalogLink = {
			href: 'https://earthengine-stac.storage.googleapis.com/catalog/catalog.json',
			rel: 'alternate',
			type: 'application/json',
			title: 'Machine-readable Earth Engine Data Catalog'
		};
		this.geeBrowsableCatalogLink = {
			rel: 'alternate',
			href: 'https://developers.google.com/earth-engine/datasets/catalog/',
			type: 'text/html',
			title: 'Human-readable Earth Engine Data Catalog'
		};
	}

	async beforeServerStart(server) {
		server.addEndpoint('get', '/collections', this.getCollections.bind(this));
		// Some endpoints may be routed through the /collections/{collection_id} endpoint due to the wildcard
		server.addEndpoint('get', ['/collections/{collection_id}', '/collections/*'], this.getCollectionById.bind(this));
		server.addEndpoint('get', '/collections/{collection_id}/queryables', this.getCollectionQueryables.bind(this));
		server.addEndpoint('get', '/collections/{collection_id}/items', this.getCollectionItems.bind(this));
		server.addEndpoint('get', '/collections/{collection_id}/items/{item_id}', this.getCollectionItemById.bind(this));
		if (this.context.stacAssetDownloadSize > 0) {
			server.addEndpoint('get', ['/assets/{asset_id}', '/assets/*'], this.getAssetById.bind(this));
		}
		server.addEndpoint('get', ['/thumbnails/{asset_id}', '/thumbnails/*'], this.getThumbnailById.bind(this));

		const a = Date.now();
		const num = await this.catalog.loadCatalog();
		console.log(`Loaded ${num} collections (${Date.now()-a} ms)`);
		return num;
	}

	async getCollections(req, res) {
		const data = this.catalog.getData().map(c => {
			return {
				stac_version: c.stac_version,
				stac_extensions: [],
				type: c.type,
				id: c.id,
				title: c.title,
				description: c.description,
				experimental: c.experimental,
				deprecated: c.deprecated,
				license: c.license,
				extent: c.extent,
				links: c.links
			};
		});


		res.json({
			collections: data,
			links: [
				{
					rel: "self",
					href: API.getUrl("/collections"),
					type: "application/json"
				},
				{
					rel: "root",
					href: API.getUrl("/"),
					type: "application/json"
				},
				{
					rel: "alternate",
					href: API.getUrl("/stac"),
					title: "STAC API",
					type: "application/json"
				},
				this.geeBrowsableCatalogLink,
				this.geeSourceCatalogLink
			]
		});
	}

	async getCollectionById(req, res) {
		const id = req.params['*'];
		if (id.length === 0) {
			// Redirect to correct route
			return await this.getCollections(req, res);
		}
		// Some endpoints may be routed through the /collections/{collection_id} endpoint due to the wildcard
		else if (id.endsWith('/queryables')) {
			return await this.getCollectionQueryables(req, res);
		}
		else if (id.endsWith('/items')) {
			return await this.getCollectionItems(req, res);
		}
		else if (id.match(/\/items\/[^/]+$/)) {
			return await this.getCollectionItemById(req, res);
		}

		const collection = this.catalog.getData(id);
		if (collection === null) {
			throw new Errors.CollectionNotFound();
		}

		res.json(collection);
	}

	async getCollectionQueryables(req, res) {
		let id = req.params.collection_id;
		// Get the ID if this was a redirect from the /collections/{collection_id} endpoint
		if (req.params['*'] && !id) {
			id = req.params['*'].replace(/\/queryables$/, '');
		}

		const queryables = this.catalog.getSchema(id);
		if (queryables === null) {
			throw new Errors.CollectionNotFound();
		}

		res.json(queryables);
	}

	async getCollectionItems(req, res) {
		let exampleFeatures = exampleItems.features; // Use imported example features
		let id = req.params.collection_id;
		// Get the ID if this was a redirect from the /collections/{collection_id} endpoint
		if (req.params['*'] && !id) {
			id = req.params['*'].replace(/\/items$/, '');
		}

		const limit = parseInt(req.query.limit, 10) || 10;
		const offset = parseInt(req.query.offset, 10) || 0;

		// Apply limit and offset
		exampleFeatures = exampleFeatures.slice(offset, offset + limit + 1);

		let hasNextPage = false;
		// We requested one additional image to check if there is a next page
		if (exampleFeatures.length > limit) {
			hasNextPage = true;
			exampleFeatures.pop();
		}

		// Replace links in example features to have correct IDs
		exampleFeatures = exampleFeatures.map(f => {
			const newFeature = Object.assign({}, f);
			newFeature.links = [
				{
					rel: "self",
					href: API.getUrl(`/collections/${id}/items/${f.id}`),
					type: "application/geo+json"
				},
				{
					rel: "root",
					href: API.getUrl(`/`),
					type: "application/json"
				},
				{
					rel: "parent",
					href: API.getUrl(`/collections/${id}`),
					type: "application/json"
				},
				{
					rel: "collection",
					href: API.getUrl(`/collections/${id}`),
					type: "application/json"
				}
			];
			return newFeature;
		});

		// Add links
		const links = [
			{
				rel: "self",
				href: API.getUrl(`/collections/${id}/items`),
				type: "application/geo+json"
			},
			{
				rel: "root",
				href: API.getUrl(`/`),
				type: "application/json"
			},
			{
				rel: "collection",
				href: API.getUrl(`/collections/${id}`),
				type: "application/json"
			}
		]
		if (offset > 0) {
			links.push({
				rel: "first",
				href: API.getUrl(`/collections/${id}/items?limit=${limit}&offset=0`),
				type: "application/geo+json"
			});
			links.push({
				rel: "prev",
				href: API.getUrl(`/collections/${id}/items?limit=${limit}&offset=${Math.max(0, offset - limit)}`),
				type: "application/geo+json"
			});
		}
		if (hasNextPage) {
			links.push({
				rel: "next",
				href: API.getUrl(`/collections/${id}/items?limit=${limit}&offset=${offset + limit}`),
				type: "application/geo+json"
			});
		}

		res.json({
			type: "FeatureCollection",
			features: exampleFeatures,
			links,
			timeStamp: Utils.toISODate(Date.now()),
			numberReturned: exampleFeatures.length
		});
	}

	async getCollectionItemById(req, res) {
		let cid = req.params.collection_id;
		let id = req.params.item_id;
		// Get the ID if this was a redirect from the /collections/{collection_id} endpoint
		if (req.params['*'] && (!cid || !id)) {
			let match = req.params['*'].match(/(.+)\/items\/([^/]+)$/);
			cid = match[1];
			id = match[2];
		}

		const features = this.exampleFeatures.filter(f => f.id === id);
		if (features.length === 0) {
			throw new Errors.ItemNotFound();
		}

		const feature = features[0];
		feature.links = [
			{
				rel: "self",
				href: API.getUrl(`/collections/${cid}/items/${id}`),
				type: "application/geo+json"
			},
			{
				rel: "root",
				href: API.getUrl(`/`),
				type: "application/json"
			},
			{
				rel: "parent",
				href: API.getUrl(`/collections/${cid}`),
				type: "application/json"
			},
			{
				rel: "collection",
				href: API.getUrl(`/collections/${cid}`),
				type: "application/json"
			}
		]

		res.json(feature);
	}

	async getThumbnailById() {
		// GEE integration removed - thumbnail generation via Google Earth Engine is no longer available
		throw new Errors.Internal({message: 'GEE integration has been removed. Thumbnail generation is not available.'});
	}

	async getAssetById() {
		// GEE integration removed - asset download via Google Earth Engine is no longer available
		throw new Errors.Internal({message: 'GEE integration has been removed. Asset download is not available.'});
	}

}
