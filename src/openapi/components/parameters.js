module.exports = {
    IDQuery: {
        in: 'query',
        name: 'id',
        schema: { $ref: '#/components/schemas/ID' },
        required: false
    },
    QueryTerm: {
        in: 'query',
        name: 'term',
        schema: {type: 'string'},
        required: false
    },
    QueryFrom: {
        in: 'query',
        name: 'from',
        schema: {
            type: 'number',
            minimum: 0
        },
        required: false
    },
    QuerySize: {
        in: 'query',
        name: 'size',
        schema: {
            type: 'number',
            minimum: 0
        },
        required: false
    },
    QuerySkip: {
        in: 'query',
        name: 'skip',
        schema: {
            type: 'number',
            minimum: 0
        }
    },
    QuerySort: {
        in: 'query',
        name: 'sort',
        schema: {
            type: 'object',
            properties: {}
        },
        style: 'form'
    }
};
