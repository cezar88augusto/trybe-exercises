// index.js
const express = require('express');
const { Address, Employee } = require('./models');

const app = express();

app.get('/employees', async (_req, res) => {
  try {
    const employees = await Employee.findAll({
      include: { model: Address, as: 'addresses' },
    });
    return res.status(200).json(employees);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: 'Ocorreu um erro' });
  };
});

/* app.get('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({
        where: { id },
        include: [{
          // para escluir um campo específico, basta colocar attibutes e o campo que desejar exluir.
          model: Address, as: 'addresses', attributes: { exclude: ['number'] },
        }],
      });
    
    if (!employee)
      return res.status(404).json({ message: 'Funcionário não encontrado' });

    return res.status(200).json(employee);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: 'Algo deu errado' });
  };
});
 */

/* Imagine que exista a função getAddress que tem como responsabilidade buscar todos os endereços de acordo com o employee_id . */

app.get('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({ where: { id } });

    if (!employee)
      return res.status(404).json({ message: 'Funcionário não encontrado' });

    if (req.query.includeAddresses === 'true') {
      const adresses = await Address.findAll({ where: { employeeId: id } });
      return res.status(200).json({ employee, adresses });
    }

    return res.status(200).json(employee);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: 'Algo deu errado' });
  };
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}`));