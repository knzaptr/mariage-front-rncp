const serialize = <T>(arg: T): T => JSON.parse(JSON.stringify(arg));

export default serialize;