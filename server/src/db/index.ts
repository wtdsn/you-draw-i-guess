interface tableInter {
  [key: string]: any
}

type bdInter = Map<string, tableInter>

class Db {
  public db: bdInter
  constructor() {
    this.db = new Map()
  }
  getTable(tableName: string) {
    let t = this.db.get(tableName)
    if (t) {
      return t
    } else {
      const table: tableInter = {}
      this.db.set(tableName, table)
      return table
    }
  }
}



export default (new Db())