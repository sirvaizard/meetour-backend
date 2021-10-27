export default interface Token {
    generate (payload: any, secret: string): string
    verify (token: string, secret: string): Promise<string | null>
}
