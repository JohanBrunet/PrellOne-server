const ldap = require('ldapjs')
const env = process.env

const ldapClient = ldap.createClient({
    url: `${env.LDAP_HOST}:${env.LDAP_PORT}`
})

let LdapController = () => {}

LdapController.find = (cred) => {
    return new Promise( (resolve, reject) => {
        const knownUser = `cn=${env.LDAP_USER},${env.LDAP_USER_OU},${env.LDAP_OU},${env.LDAP_DC}`
        const knownUserPwd = env.LDAP_PWD
        ldapClient.bind(knownUser, knownUserPwd, (err) => {
            if (err) reject(err)
            else {
                var opts = {
                    filter: `(cn=${cred})`,
                    scope: 'sub'
                };
        
                ldapClient.search(`${env.LDAP_OU},${env.LDAP_DC}`, opts, function (err, res) {
                    if (err) {
                        reject(err)
                    } else {
                        res.on('searchEntry', function (entry) {
                            resolve(entry.objectName)
                        });
                    }
                })
            }
        })
    })
}

LdapController.auth = (dn, pwd) => {
    return new Promise( (resolve, reject) => {
        ldapClient.bind(dn, pwd, (err) => {
            if (err) reject(err)
            else resolve()
        })
    })
}

module.exports = LdapController