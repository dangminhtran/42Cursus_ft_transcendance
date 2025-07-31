import fastify from 'fastify'
import fp from 'fastify-plugin'

export interface DbClientOptions {
	baseURL: string,
	tokenHeader?: string
};

declare module 'fastify' {
	interface FastifyInstance {
		dbClient: {
			get<T = any>(path: string, headers?: Record<string, string>): Promise<T>
			post<T = any>(path: string, data: any, headers?: Record<string, string>): Promise<T>
		}
	}
}

export default fp<DbClientOptions>(async (fastify, opts) => {
	const { baseURL, tokenHeader = 'authorization' } = opts

	const call = async <T>(method: string, path: string, data?: any, extraHeaders = {}) => {
		const url = new URL(path, baseURL).toString()
		const headers: Record<string, string> = {
			'content-type': 'application/json',
			...extraHeaders
		}
		const reqHdr = (fastify as any).request?.headers?.[tokenHeader]
		if (typeof reqHdr === 'string') {
			headers[tokenHeader] = reqHdr
		}

		const response = await fetch(url, {
			method,
			headers,
			body: data != null ? JSON.stringify(data) : undefined
		})

		if (response.status >= 400) {
			return null as unknown as Promise<T>;
		}
		return response.json() as Promise<T>
	}

	fastify.decorate('dbClient', {
		get: <T>(path: string, headers?: Record<string, string>) => call<T>('GET', path, undefined, headers),
		post: <T>(path: string, data: any, headers?: Record<string, string>) => call<T>('POST', path, data, headers),
	})
})