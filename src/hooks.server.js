/** @type {import('@sveltejs/kit').Handle} */
import { building } from '$app/environment';

import xssec from '@sap/xssec';
import xsenv from '@sap/xsenv';

let creds;

if (!building) {
	const services = xsenv.readServices();

	creds = services['svelte-kit-web-comp-uaa']?.credentials;
}

export async function handle({ event, resolve }) {
	const auth = event.request.headers.get('authorization');

	// inspired by xssec, jwt_auth-implementation
	function getUser(tokenInfo) {
		const payload = tokenInfo.getPayload();

		let id = payload.user_name;

		// Roles = scope names w/o xsappname
		const xsappname = new RegExp(`^${creds.xsappname}\\.`);
		let roles = payload.scope.map((s) => s.replace(xsappname, ''));

		// Disallow setting system roles from external
		roles = roles.filter((r) => !(r in { 'internal-user': 1, 'system-user': 1 }));

		if (payload.grant_type in { client_credentials: 1, client_x509: 1 }) {
			id = 'system';
			roles.push('system-user');
			if (tokenInfo.getClientId() === creds.clientid) roles.push('internal-user');
		}

		const attr = Object.assign({}, payload['xs.user.attributes']);
		attr.logonName = payload.user_name;
		attr.givenName = payload.given_name;
		attr.familyName = payload.family_name;
		attr.email = payload.email;

		return { id, roles, attr, tokenInfo };
	}

	const token = auth?.split(/^bearer /i)[1];

	const user = token
		? await new Promise((resolve, reject) => {
				xssec.v3.createSecurityContext(token, creds, function (err, securityContext, tokenInfo) {
					if (err) return reject(err);

					const user = getUser(tokenInfo);

					return resolve(user);
				});
			})
		: {};

	event.locals.user = user;
	event.locals.token = auth;
	return resolve(event);
}
