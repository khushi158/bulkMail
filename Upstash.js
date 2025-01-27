const { Redis } =require('@upstash/redis')

    const redis = new Redis({
    url: 'https://firm-lion-58024.upstash.io',
    token: 'AeKoAAIjcDE3YjczYzBjOGU1OTc0ZDZhOTMxZmFkOWFlZWYyZmJjN3AxMA'}
)

    module.exports = redis;