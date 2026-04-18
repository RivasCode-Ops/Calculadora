def somar(a, b):
    return a + b

def subtrair(a, b):
    return a - b

def multiplicar(a, b):
    return a * b

def dividir(a, b):
    if b == 0:
        return "Erro: Divisão por zero"
    return a / b

def calcular():
    print("=== Calculadora ===")
    print("1 - Soma")
    print("2 - Subtração")
    print("3 - Multiplicação")
    print("4 - Divisão")
    print("5 - Sair")
    
    opcao = input("Escolha uma opção: ")
    
    if opcao == "5":
        print("Saindo...")
        return
    
    try:
        num1 = float(input("Primeiro número: "))
        num2 = float(input("Segundo número: "))
        
        if opcao == "1":
            print(f"Resultado: {somar(num1, num2)}")
        elif opcao == "2":
            print(f"Resultado: {subtrair(num1, num2)}")
        elif opcao == "3":
            print(f"Resultado: {multiplicar(num1, num2)}")
        elif opcao == "4":
            print(f"Resultado: {dividir(num1, num2)}")
        else:
            print("Opção inválida")
    except ValueError:
        print("Erro: Digite números válidos")

if __name__ == "__main__":
    calcular()