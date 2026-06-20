class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return this.model.findAll(options);
  }

  async findById(id, options = {}) {
    return this.model.findByPk(id, options);
  }

  async findOne(options = {}) {
    return this.model.findOne(options);
  }

  async create(data, options = {}) {
    return this.model.create(data, options);
  }

  async update(id, data, options = {}) {
    // Pass options to findById to preserve transaction context
    const record = await this.findById(id, options);
    if (!record) return null;
    return record.update(data, options);
  }

  async delete(id, options = {}) {
    const record = await this.findById(id, options);
    if (!record) return null;
    return record.destroy(options);
  }

  async findAndCountAll(options = {}) {
    return this.model.findAndCountAll(options);
  }
  
  async exists(options = {}) {
    const count = await this.model.count(options);
    return count > 0;
  }

  async upsert(data, options = {}) {
    return this.model.upsert(data, options);
  }

  async paginate(page = 1, limit = 10, options = {}) {
    const offset = (page - 1) * limit;
    const data = await this.findAndCountAll({
      ...options,
      limit,
      offset
    });
    
    return {
      totalItems: data.count,
      items: data.rows,
      totalPages: Math.ceil(data.count / limit),
      currentPage: Number(page)
    };
  }
}

export default BaseRepository;
