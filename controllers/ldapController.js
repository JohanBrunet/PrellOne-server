const LdapClient = require('ldapjs-client')
const env = process.env

const ldapURL = `${env.LDAP_HOST}:${env.LDAP_PORT}`
const ldapClient = new LdapClient({ url: ldapURL })

let LdapController = () => { }

LdapController.auth = async (cred, pwd) => {
    const ldapOU = env.LDAP_USER.split('.').lenght === 1 ? env.LDAP_OU_PERM : env.LDAP_OU_ETU
    const knownUser = `cn=${env.LDAP_USER},${env.LDAP_USER_OU},${ldapOU},${env.LDAP_DC}`
    const knownUserPwd = env.LDAP_PWD

    try {
        await ldapClient.bind(knownUser, knownUserPwd)
        const opts = {
            filter: `(cn=${cred})`,
            scope: 'sub'
        };

        const searchOU = cred.split('.').lenght === 1 ? env.LDAP_OU_PERM : env.LDAP_OU_ETU

        const result = await ldapClient.search(`${searchOU},${env.LDAP_DC}`, opts)
        const userDn = result[0].dn
        await ldapClient.bind(userDn, pwd)
    }
    catch (error) {
        throw error
    }
}
module.exports = LdapController