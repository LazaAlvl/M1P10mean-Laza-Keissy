const  User  = require('../models/userModel');
const bcrypt = require('bcryptjs');

module.exports.RegisterClient = async (req, res, next) => {
    const salt= await bcrypt.genSalt(10);
    const { firstname, lastname, email, password, number } = req.body;
    const hashpassword = await bcrypt.hash(password,salt);
  try{  
    const client = new User({
        firstname,
        lastname,
        email,
        password: hashpassword,
        number
    });
    await client.save();
    return res.status(200).json('Client register successfully');

} catch (error) {
    // Gérer les erreurs
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports.LoginClient = async (req, res, next) => {
  try
  {  
    const client = await User.findOne({email: req.body.email});
        if(!client)
        {
            return res.status(404).json('Client not found');
        }
    const isPasswordCorrect = await bcrypt.compare(req.body.password, client.password)
        if(!isPasswordCorrect)
        {
            return res.status(400).json('Password incorrect!');
        }

    return res.json({client});

} catch (error) {
    // Gérer les erreurs
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


// ---------- Gestion Employe ----------
module.exports.RegisterEmploye = async (req, res, next) => {
  const salt= await bcrypt.genSalt(10);
  const { firstname, lastname, email, password, number, role } = req.body;
  const hashpassword = await bcrypt.hash(password,salt);
  try{  
    const client = new User({
        firstname,
        lastname,
        email,
        password: hashpassword,
        number,
        role
  });
    await client.save();
    return res.status(201).json('Employee register successfully');

  } catch (error) {
    // Gérer les erreurs
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports.GetEmployeesAndManagers = async (req, res, next) => {
  try {
    // Requête pour trouver les employés et les managers
    const employeesAndManagers = await User.find({ role: { $in: ['Manager', 'Employee'] } });

    if (!employeesAndManagers || employeesAndManagers.length === 0) {
      return res.status(404).json({ error: 'No employees or managers found' });
    }

    res.status(200).json(employeesAndManagers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports.UpdateEmployeeInfo = async (req, res, next) => {
  const { id } = req.params;
  const { firstname, lastname, email, number, role, password } = req.body;

  try {
    // Gestion du cas où le mot de passe est modifié
    let updatedFields = {
      firstname,
      lastname,
      email,
      number,
      role
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(password, salt);
      updatedFields.password = hashpassword;
    }

    const updatedEmployee = await User.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports.DeleteEmployee = async (req, res, next) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json('Employee deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}