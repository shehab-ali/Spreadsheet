import mariadb from 'mariadb';

export class dbConnector {

    private db: mariadb.Pool;
    private static instance: dbConnector = new dbConnector();

    // Singleton pattern to ensure only one instance of the dbConnector is created
    private constructor() {
        this.db = mariadb.createPool({
            host: process.env.DB_HOST, 
            user: process.env.DB_USER, 
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });

    }

    static getInstance() {
        return this.instance;
    }

    static async getConnection() {
        return await this.instance.db.getConnection();
    }

    static async queryDB(query: string, params: string[]) {
        let conn;
        try {
      
          conn = await this.instance.db.getConnection();
          return await conn.query(query, params);

        } finally {
          if (conn) conn.release(); //release to pool
        }

    }



}