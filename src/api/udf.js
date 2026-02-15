export default class UdfRuntimesApi {
    constructor(context) {
        this.context = context;
    }

    beforeServerStart(server) {
        server.addEndpoint('get', '/udf_runtimes', this.listUdfRuntimes.bind(this));
        return Promise.resolve();
    }

    async listUdfRuntimes(req, res) {
        // for now return hardcoded runtimes
        res.json(
            {
                "Python": {
                    "default": "3",
                    "title": "Python",
                    "type": "language",
                    "versions": {
                        "3": {
                            "libraries": {
                                "geopandas": {
                                    "version": "1.0.1"
                                },
                                "netCDF4": {
                                    "version": "1.7.3"
                                },
                                "numpy": {
                                    "version": "2.3.3"
                                },
                                "openeo": {
                                    "version": "0.46.0a1.dev20250928+830"
                                },
                                "pandas": {
                                    "version": "2.3.3"
                                },
                                "pyproj": {
                                    "version": "3.4.1"
                                },
                                "rasterio": {
                                    "version": "1.3.11"
                                },
                                "scipy": {
                                    "version": "1.16.2"
                                },
                                "shapely": {
                                    "version": "2.1.2"
                                },
                                "xarray": {
                                    "version": "2024.7.0"
                                }
                            }
                        },
                        "3.11": {
                            "libraries": {
                                "geopandas": {
                                    "version": "1.0.1"
                                },
                                "netCDF4": {
                                    "version": "1.7.3"
                                },
                                "numpy": {
                                    "version": "2.3.3"
                                },
                                "openeo": {
                                    "version": "0.46.0a1.dev20250928+830"
                                },
                                "pandas": {
                                    "version": "2.3.3"
                                },
                                "pyproj": {
                                    "version": "3.4.1"
                                },
                                "rasterio": {
                                    "version": "1.3.11"
                                },
                                "scipy": {
                                    "version": "1.16.2"
                                },
                                "shapely": {
                                    "version": "2.1.2"
                                },
                                "xarray": {
                                    "version": "2024.7.0"
                                }
                            }
                        },
                        "3.8": {
                            "libraries": {
                                "geopandas": {
                                    "version": "0.13.2"
                                },
                                "netCDF4": {
                                    "version": "1.7.2"
                                },
                                "numpy": {
                                    "version": "1.22.4"
                                },
                                "openeo": {
                                    "version": "0.46.0a1.dev20251014+832"
                                },
                                "pandas": {
                                    "version": "1.5.3"
                                },
                                "pyproj": {
                                    "version": "3.4.1"
                                },
                                "rasterio": {
                                    "version": "1.2.10"
                                },
                                "scipy": {
                                    "version": "1.8.1"
                                },
                                "shapely": {
                                    "version": "2.0.7"
                                },
                                "xarray": {
                                    "version": "0.16.2"
                                }
                            }
                        }
                    }
                },
                "Python-Jep": {
                    "default": "3.8",
                    "title": "Python-Jep",
                    "type": "language",
                    "versions": {
                        "3.8": {
                            "libraries": {
                                "geopandas": {
                                    "version": "0.13.2"
                                },
                                "netCDF4": {
                                    "version": "1.7.2"
                                },
                                "numpy": {
                                    "version": "1.22.4"
                                },
                                "openeo": {
                                    "version": "0.46.0a1.dev20251014+832"
                                },
                                "pandas": {
                                    "version": "1.5.3"
                                },
                                "pyproj": {
                                    "version": "3.4.1"
                                },
                                "rasterio": {
                                    "version": "1.2.10"
                                },
                                "scipy": {
                                    "version": "1.8.1"
                                },
                                "shapely": {
                                    "version": "2.0.7"
                                },
                                "xarray": {
                                    "version": "0.16.2"
                                }
                            }
                        }
                    }
                }
            });
    }
}
