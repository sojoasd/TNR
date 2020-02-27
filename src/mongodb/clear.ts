const clearModels = <T>(models: any[]): T => {
    models.map(m => {
        delete m._id;
        delete m.__v;
    });

    return models as unknown as T;
}

const clearModel = (models: any): void => {
    delete models._id;
        delete models.__v;
}

export {clearModel, clearModels}