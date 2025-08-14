// companyModel.js
export const CompanyModel = {
  async searchCompanies(keyword) {
    const result = await pool.query(
      "SELECT * FROM companies WHERE name ILIKE $1 OR ticker ILIKE $1 LIMIT 20",
      [`%${keyword}%`]
    );
    return result.rows;
  },
};
