import {
    CRUDController
} from "../../../index";

export class DummyModel {
    static db: Map<string, DummyModel> = new Map();

    save() {
        DummyModel.db.set(this['id'], Object.assign({},this));
        return this;
    }

    static updateById(id, data: any) {
        data.id = id;
        DummyModel.db.set(data.id, {...data});
        return data;
    }

    static removeById(id) {
        const item = DummyModel.db.get(id);
        DummyModel.db.delete(id);
        return item;
    }

    static findById(id) {
        return DummyModel.db.get(id);
    }

    static find() {
        return Array.from(DummyModel.db.values());
    }


}

// @CRUDController(DummyModel, '/crud-test')
export class CrudController{
}