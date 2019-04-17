export class CrudTest{
    static db: Map<string, CrudTest> = new Map();

    save(data: any) {
        CrudTest.db.set(data.id, {...data});
        return data;
    }

    static updateById(id, data: any) {
        data.id = id;
        CrudTest.db.set(data.id, {...data});
        return data;
    }

    static removeById(id) {
        return CrudTest.db.get(id);
    }

    static findById(id) {
        return CrudTest.db.get(id);
    }

    static find() {
        return Array.from(CrudTest.db.values());
    }


}