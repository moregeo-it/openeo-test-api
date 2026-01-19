import API from '../utils/API.js';
import Utils from '../utils/utils.js';
import Errors from '../utils/errors.js';

export default class Data {

 	exampleFeatures = [
		{
	      "type": "Feature",
	      "id": "sample-point-001",
	      "stac_version": "1.0.0",
	      "stac_extensions": [
	        "https://stac-extensions.github.io/version/v1.0.0/schema.json"
	      ],
	      "bbox": [102.0, 0.5, 102.0, 0.5],
	      "geometry": {
	        "type": "Point",
	        "coordinates": [102.0, 0.5]
	      },
	      "properties": {
	        "datetime": "2024-06-01T12:00:00Z",
	        "name": "Sample Point",
	        "description": "This is a sample point."
	      },
	      "assets": {}
	    },
	    {
	      "type": "Feature",
	      "id": "sample-linestring-001",
	      "stac_version": "1.0.0",
	      "stac_extensions": [
	        "https://stac-extensions.github.io/version/v1.0.0/schema.json"
	      ],
	      "bbox": [102.0, 0.0, 105.0, 1.0],
	      "geometry": {
	        "type": "LineString",
	        "coordinates": [
	          [102.0, 0.0],
	          [103.0, 1.0],
	          [104.0, 0.0],
	          [105.0, 1.0]
	        ]
	      },
	      "properties": {
	        "datetime": "2024-06-02T12:00:00Z",
	        "name": "Sample LineString",
	        "description": "This is a sample line."
	      },
	      "assets": {}
	    },
	    {
	      "type": "Feature",
	      "id": "sample-polygon-001",
	      "stac_version": "1.0.0",
	      "stac_extensions": [
	        "https://stac-extensions.github.io/version/v1.0.0/schema.json"
	      ],
	      "bbox": [100.0, 0.0, 101.0, 1.0],
	      "geometry": {
	        "type": "Polygon",
	        "coordinates": [
	          [
	            [100.0, 0.0],
	            [101.0, 0.0],
	            [101.0, 1.0],
	            [100.0, 1.0],
	            [100.0, 0.0]
	          ]
	        ]
	      },
	      "properties": {
	        "datetime": "2024-06-03T12:00:00Z",
	        "name": "Sample Polygon",
	        "description": "This is a sample polygon."
	      },
	      "assets": {}
	    }]

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
		let id = req.params.collection_id;
		// Get the ID if this was a redirect from the /collections/{collection_id} endpoint
		if (req.params['*'] && !id) {
			id = req.params['*'].replace(/\/items$/, '');
		}

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

		res.json({
			type: "FeatureCollection",
			features: this.exampleFeatures,
			links,
			timeStamp: Utils.toISODate(Date.now()),
			numberReturned: this.exampleFeatures.length
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

	async getThumbnailById(req, res) {
		// GEE integration removed - thumbnail generation via Google Earth Engine is no longer available
		throw new Errors.Internal({message: 'GEE integration has been removed. Thumbnail generation is not available.'});
	}

	async getAssetById(req, res) {
		// GEE integration removed - asset download via Google Earth Engine is no longer available
		throw new Errors.Internal({message: 'GEE integration has been removed. Asset download is not available.'});
	}

}
