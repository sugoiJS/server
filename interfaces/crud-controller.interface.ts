
export interface  ICRUDController<ResourceType = any>{
    create(req, res, next): Promise<ResourceType>;

    read(req, res, next): Promise<ResourceType | ResourceType[] >;

    update(req, res, next): Promise<ResourceType>;

    delete(req, res, next): Promise<ResourceType>;
}