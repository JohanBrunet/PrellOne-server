const ldap = require('ldapjs')
const env = process.env

const ldapURL = `${env.LDAP_HOST}:${env.LDAP_PORT}`

const ldapClient = ldap.createClient({
    url: ldapURL
})

let LdapController = () => { }

/*AUTHENTIFICATION LDAP*/
LdapController.auth = (cred, pwd) => {
    return new Promise( (resolve, reject) => {
        const ldapOU = env.LDAP_USER.split('.').lenght === 1 ? env.LDAP_OU_PERM : env.LDAP_OU_ETU
        const knownUser = `cn=${env.LDAP_USER},${env.LDAP_USER_OU},${ldapOU},${env.LDAP_DC}`
        const knownUserPwd = env.LDAP_PWD
        ldapClient.bind(knownUser, knownUserPwd, (err) => {
            if (err) reject(err)
            else {
                var opts = {
                    filter: `(cn=${cred})`,
                    scope: 'sub'
                };

                const searchOU = cred.split('.').lenght === 1 ? env.LDAP_OU_PERM : env.LDAP_OU_ETU

                ldapClient.search(`${searchOU},${env.LDAP_DC}`, opts, function (err, res) {
                    if (err) {
                        reject(err)
                    } else {
                        res.on('searchEntry', function (entry) {
                            const dn = entry.objectName
                            ldapClient.bind(dn, pwd, (err) => {
                                if (err) reject(err)
                                else resolve()
                            })
                        })
                    }
                })
            }
        })
    })
}

// LdapController.auth = async(dn, pwd) => {
//     return await new Promise( (resolve, reject) => {
//         ldapClient.bind(dn, pwd, (err) => {
//             if (err) return reject(err)
//             else return resolve()
//         })
//     })
// }

module.exports = LdapController