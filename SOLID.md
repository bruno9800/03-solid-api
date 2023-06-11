# SOLID - ( 5 princípios )

- **D** -> Dependency Inversion Principle ( Principio de inversão de dependência )
  RegisterUseCase _depende de_ PrismaUsersRepository
  - Nesse caso, se for preciso mudar o UsersRepository, o UseCase precisa ser alterado;
  - RegisterUseCase cria uma instancia de PrismaUsersRepository
  * **Aplicando o Principio**
  - Ao invés da classe UseCase instanciar as dependências que precisa, ela recebe as dependerias como parâmetro
