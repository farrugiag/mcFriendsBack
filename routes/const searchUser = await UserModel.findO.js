const searchUser = await UserModel.findOne({ token: req.body.token });
const user = {
  nom: searchUser.nom,
  prenom: searchUser.prenom,
  dateDeNaissance: searchUser.dateDeNaissance,
  civilite: searchUser.civilite,
  email: searchUser.email,
};
