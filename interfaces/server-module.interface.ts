export interface IServerModule {
    onLoad(): void | Promise<void>
}
