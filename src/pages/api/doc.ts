import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
    definition: {
        "swagger": "2.0",
        "info": {
            "description": "Documentação para teste da API",
            "version": "3.0.0",
            "title": "Swagger TMG",
        },
        "host": "localhost:3000",
        "basePath": "/api",
        "tags":
            [
                {
                    "name": "user",
                    "description": "Operations about user",
                },
                {
                    "name": "cultura",
                    "description": "Enpoints relacionados a cultura",
                }
            ],
        "schemes": ["http"],
        "paths": {
            "/culture": {
                "get": {
                    "tags": ["cultura"],
                    "summary": "Lista todas a culturas cadastradas no banco",
                    "produces": ["application/json"],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                        },
                        "400": {
                            "description": "Invalid status value"
                        },
                        "405": {
                            "description": "Validation exception"
                        }
                    }
                },
                "post": {
                    "tags": ["cultura"],
                    "summary": "Adiciona uma nova cultura",
                    "description": "",
                    "operationId": "id",
                    "consumes": ["application/json"],
                    "produces": ["application/xml", "application/json"],
                    "parameters": [{
                        "in": "body",
                        "name": "body",
                        "description": "cultura a ser salva",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/Culture"
                        }
                    }],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    }
                },

            },
            "/culture/{id}": {
                "get": {
                    "tags": ["cultura"],
                    "summary": "Lista uma unica cultura",
                    "description": "Lista a cultura buscada de acordo com o id passado",
                    "operationId": "id",
                    "produces": ["application/json"],
                    "parameters": [{
                        "name": "id",
                        "in": "path",
                        "description": "id, da cultura a ser buscada",
                        "required": true,
                        "type": "integer",
                    }],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                        },
                        "400": {
                            "description": "Invalid status value"
                        },
                        "405": {
                            "description": "Validation exception"
                        }
                    }
                },
                "put": {
                    "tags": ["cultura"],
                    "summary": "Edita a cultura desejada",
                    "description": "",
                    "operationId": "id",
                    "consumes": ["application/json"],
                    "produces": ["application/json"],
                    "parameters":
                        [
                            {
                                "in": "body",
                                "name": "body",
                                "description": "",
                                "required": true,
                                "schema": {
                                    "$ref": "#/definitions/Culture"
                                }
                            },
                            {
                                "name": "id",
                                "in": "path",
                                "description": "id, da cultura a ser buscada",
                                "required": true,
                                "type": "integer",
                            }
                        ],
                    "security": {
                        "petstore_auth": ["write:pets", "read:pets"]
                    },
                    "responses": {
                        "400": {
                            "description": "id invalido"
                        },
                        "404": {
                            "description": "cultura não existe"
                        },
                        "405": {
                            "description": "Metodo não existe"
                        }
                    }
                }
            },
            "/user/{id}": {
                "put": {
                    "tags": ["user"],
                    "summary": "Edita um usuario",
                    "description": "",
                    "operationId": "id",
                    "consumes": ["application/json"],
                    "produces": ["application/json"],
                    "parameters":
                        [
                            {
                                "in": "body",
                                "name": "body",
                                "description": "",
                                "required": true,
                                "schema": {
                                    "$ref": "#/definitions/User"
                                }
                            },
                            {
                                "name": "id",
                                "in": "path",
                                "description": "id, da cultura a ser buscada",
                                "required": false,
                                "type": "integer",
                            }
                        ],
                    "security": {
                        "petstore_auth": ["write:users", "read:users"]
                    },
                    "responses": {
                        "400": {
                            "description": "id invalido"
                        },
                        "404": {
                            "description": "cultura não existe"
                        },
                        "405": {
                            "description": "Metodo não existe"
                        }
                    }
                }
            },
        },
        "definitions": {
            "Culture": {
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
                        "type": "integer",
                        "description": "1: Ativo, 0: Inativo"
                    },
                }
            },
            "User": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64",
                    },
                    "login": {
                        "type": "string",
                        "description": "Login do Usuario",
                    },
                    "name": {
                        "type": "string",
                        "description": "Nome do Usuario",
                    },
                    "password": {
                        "type": "string",
                        "description": "Password do usuario",
                    },
                    "id_profile": {
                        "type": "integer",
                        "description": "ID relacionado ao perfil de permissão do usuario",
                    },
                    "status": {
                        "type": "integer",
                        "description": "1: Ativo, 0: Inativo"
                    },
                }
            }
        },
    }, apiFolder: 'pages/api',
});
export default swaggerHandler();