import {AuthService} from './services/AuthService.js'
import {ContainerBuilder} from 'tiny-dependecy-injection'
import {AuthController} from "./controllers/AuthController.js"
import {AuthRepository} from "./repositories/AuthRepository.js"
import {SqliteClient} from "./client/SqliteClient.js";

function registerServices(container) {
    container.register('auth-service', AuthService)
        .addArgument('@auth-repository')
        .addArgument(10)
        .asSingleton()
}

function registerRepositories(container) {
    container.register('auth-repository', AuthRepository)
        .addArgument('@sqlite-clien')
        .asSingleton()
}

function registerControllers(container) {
    container.register('auth-controller', AuthController)
        .addArgument('@auth-service')
        .asSingleton()
}

function registerClients(container) {
    container.register('sqlite-clien', SqliteClient)
        .addArgument('database')
}

function IoC() {
    const container = new ContainerBuilder()

    registerRepositories(container)
    registerServices(container)
    registerControllers(container)
    registerClients(container)

    return container
}

export default IoC()