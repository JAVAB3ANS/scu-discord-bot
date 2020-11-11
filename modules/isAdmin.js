/*
 .----------------.  .----------------.  .----------------.  .----------------.  .-----------------.                    
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |                    
| |      __      | || |  ________    | || | ____    ____ | || |     _____    | || | ____  _____  | |                    
| |     /  \     | || | |_   ___ `.  | || ||_   \  /   _|| || |    |_   _|   | || ||_   \|_   _| | |                    
| |    / /\ \    | || |   | |   `. \ | || |  |   \/   |  | || |      | |     | || |  |   \ | |   | |                    
| |   / ____ \   | || |   | |    | | | || |  | |\  /| |  | || |      | |     | || |  | |\ \| |   | |                    
| | _/ /    \ \_ | || |  _| |___.' / | || | _| |_\/_| |_ | || |     _| |_    | || | _| |_\   |_  | |                    
| ||____|  |____|| || | |________.'  | || ||_____||_____|| || |    |_____|   | || ||_____|\____| | |                    
| |              | || |              | || |              | || |              | || |              | |                    
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |                    
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------'                     
 */

module.exports = async function isAdmin(client, message, statement) {
  let error = require("./missingPerms.js");
  const modRole = client.config.serverRoles;
  if(!message.member.roles.cache.some(r=>["Owner", "Admin", "Mod"].includes(r.name) || r=>[modRole.owner, modRole.admin, modRole.mod].includes(r.id))) {
      message.delete();
      error(`You don't have one of the following roles: \`OWNER\`, \`ADMIN\`, \`MOD\``, message);
      console.log(`User is not an Owner, Admin, or Mod`); 
      return;
  } else {
     console.log(`User is either an Owner, Admin, or Mod`);
  }
}
