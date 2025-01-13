# Descripción

Este proyecto consiste en la creación de un "compilador" para la materia de Programación de Sistemas Base I y II. El "compilador" traduce el lenguaje de programación Pitón (un lenguaje creado por nosotros) al lenguaje de programación Python. El programa traducido se puede ejecutar en Python.

# Uso

Para usar el "compilador", ingresa un código fuente escrito en Pitón y selecciona la opción de `Compiladr > Traducir`.

## Funciones soportadas

| Función | Traducción | Descripción |
| --- | --- | --- |
| `imprimir` | `print` | Imprime un mensaje en la consola |
| `entrada` | `input` | Solicita un valor al usuario |
| `suma` | `sum` | Suma los elementos de una secuencia |
| `longitud` | `len` | Obtiene la longitud de una secuencia |
| `lista` | `list` | Crea una lista a partir de una secuencia |
| `cadena` | `str` | Convierte un valor a una cadena |
| `rango` | `range` | Genera una secuencia de números |
| `cremallera` | `zip` | Combina dos secuencias |
| `flotante` | `float` | Convierte un valor a un flotante |
| `entero` | `int` | Convierte un valor a un entero |
| `rebanada` | `slice` | Crea una rebanada de una secuencia |
| `redondear` | `round` | Redondea un número |
| `tupla` | `tuple` | Crea una tupla a partir de una secuencia |
| `tipo` | `type` | Obtiene el tipo de un valor |
| `ordenado` | `sorted` | Ordena una secuencia |
| `potencia` | `pow` | Eleva un número a una potencia |
| `conjunto` | `set` | Crea un conjunto a partir de una secuencia |

Para más información, consulte la documentación de Python: https://docs.python.org/3/library/functions.html

## Palabras clave soportadas

| Palabra reservada | Traducción | Descripción |
| --- | --- | --- |
| `si` | `if` | Inicia una estructura condicional |
| `osi` | `elif` | Agrega una condición a una estructura condicional |
| `sino` | `else` | Agrega una condición por defecto a una estructura condicional |
| `para` | `for` | Inicia un ciclo `for` |
| `en` | `in` | Itera sobre una secuencia (se usa como parte de un ciclo `for`) |
| `mientras` | `while` | Inicia un ciclo `while` |
| `O` | `or` | `or` lógico |
| `Y` | `and` | `and` lógico |
| `NO` | `not` | `not` lógico |
| `Verdadero` | `True` | Palabra reservada para representar un valor verdadero |
| `Falso` | `False` | Palabra reservada para representar un valor falso |
| `Nada` | `None` | Palabra reservada para representar un valor nulo |

Para más información, consulte la documentación de Python: https://docs.python.org/3/reference/lexical_analysis.html#keywords

## Limitaciones

- No se pueden declarar listas, tuplas o diccionarios: `[]`, `()`, `{}`.
- Solo se puede identar usando tabuladores; no se permite el uso de espacios para identar.
- No se puede dejar espacios en blanco al final del archivo.
- Solo se soportan caracteres ASCII; no se permiten acentos en el código fuente.

# Ejemplo

Entrada:

```
limite = entero(entrada("Ingresa un limite: "))

para num en rango(1, limite + 1):
	si num % 15 == 0:
		imprimir("FizzBuzz")
	osi num % 3 == 0:
		imprimir("Fizz")
	osi num % 5 == 0:
		imprimir("Buzz")
	sino:
		imprimir(num)
```

Salida:

```
limite = int(input("Ingresa un limite: "))

for num in range(1, limite + 1):
	if num % 15 == 0:
		print("FizzBuzz")
	elif num % 3 == 0:
		print("Fizz")
	elif num % 5 == 0:
		print("Buzz")
	else:
		print(num)
```

# Integrantes del Equipo

- Franco Beltrán, José Alan (líder)
- González Ortiz, Brayan de Jesús
- González Paz, Salma
- González Regalado, Efraín
- Guerrero Aguilar, Juan Manuel
- Lozano Flores, Ángel Ezequiel
- Martínez Rivera, Milton Yahir
- Ramos Rodríguez, Cesia Keren
- Rebollar Cabriales, Carlos Eduardo
