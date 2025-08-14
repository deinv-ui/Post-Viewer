// companyController.js
export const CompanyController = {
  async search(req, res) {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query required" });

    const results = await CompanyModel.searchCompanies(q);
    res.json(results);
  },
};
