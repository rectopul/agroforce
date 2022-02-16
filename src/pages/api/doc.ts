import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
    definition: {
        "swagger" : "2.0",
        "info" : {
        "description" : "Documentação para teste da API",
        "version" : "3.0.0",
        "title" : "Swagger TMG",
        },
        "host" : "localhost:3000",
        "basePath" : "/api",
        "tags" : [ {
        "name" : "user",
        "description" : "Operations about user",
        },  {
            "name" : "cultura",
            "description" : "Enpoints relacionados a cultura",
        } ],
        "schemes" : [ "http" ],
        "paths" : {
            "/cultura" : {
                "get" : {
                    "tags" : [ "cultura" ],
                    "summary" : "Lista todas a culturas cadastradas no banco",
                    "produces" : [ "application/json" ],
                    "responses" : {
                    "200" : {
                        "description" : "successful operation",
                    },
                    "400" : {
                        "description" : "Invalid status value"
                    },
                    "405" : {
                        "description" : "Validation exception"
                    }
                    }
                },
                "post" : {
                    "tags" : [ "cultura" ],
                    "summary" : "Adiciona uma nova cultura",
                    "description" : "",
                    "operationId" : "id",
                    "consumes" : [ "application/json", "application/xml" ],
                    "produces" : [ "application/xml", "application/json" ],
                    "parameters" : [{
                        "in" : "body",
                        "name" : "body",
                        "description" : "cultura a ser salva",
                        "required" : true,
                        "schema": {
                            "$ref": "#/definitions/Cultura"
                        }                
                    }],
                    "responses" : {
                        "405" : {
                        "description" : "Invalid input"
                        }
                    }
                },
                "put" : {
                    "tags" : [ "cultura" ],
                    "summary" : "Edita a cultura desejada",
                    "description" : "",
                    "operationId" : "id",
                    "consumes" : [ "application/json", "application/xml" ],
                    "produces" : [ "application/xml", "application/json" ],
                    "parameters" : [{
                        "in" : "body",
                        "name" : "body",
                        "description" : "Pet object that needs to be added to the store",
                        "required" : true,
                        "schema" : {
                        "$ref" : "#/definitions/Cultura"
                        }
                    }],
                    "security" :{
                        "petstore_auth" : [ "write:pets", "read:pets" ]
                    },
                    "responses" : {
                        "400" : {
                        "description" : "Invalid ID supplied"
                        },
                        "404" : {
                        "description" : "Pet not found"
                        },
                        "405" : {
                        "description" : "Validation exception"
                        }
                    }
                }
            },
            "/cultura/{id}": {
                "get" : {
                    "tags" : [ "cultura" ],
                    "summary" : "Lista uma unica cultura",
                    "description" : "Lista a cultura buscada de acordo com o id passado",
                    "operationId" : "id",
                    "produces" : ["application/json" ],
                    "parameters" : {
                        "name" : "id",
                        "in" : "path",
                        "description" : "id, da cultura a ser buscada",
                        "required" : true,
                        "type" : "int",
                    },
                    "responses" : {
                        "200" : {
                            "description" : "successful operation",
                        },
                        "400" : {
                            "description" : "Invalid status value"
                        },
                        "405" : {
                            "description" : "Validation exception"
                        }
                    }
                }
            },
        },
        "definitions": {
            "Cultura": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64",
                    },
                    "name": {
                        "type": "string",
                        "description": "Nome da cultura",
                    },
                    "status": {
                        "type": "int",
                        "description": "1: Ativo, 0: Inativo",
                    },
                }
            }
        } ,
    }, apiFolder: 'pages/api',
});
export default swaggerHandler();