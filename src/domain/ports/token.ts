export default interface Token {
    generate (payload: any, secret: string): Promise<string>
}
