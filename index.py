import mysql.connector
from mysql.connector import Error

try:
    connection = mysql.connector.connect(
        host='82.180.174.52',
        database='u208195001_mssinergy',
        user='u208195001_ltAndres',
        password='Mssinergy2024!'
    )

    if connection.is_connected():
        print("✅ Conexión exitosa a la base de datos")

except Error as e:
    print(f"❌ Error al conectar: {e}")

finally:
    if 'connection' in locals() and connection.is_connected():
        connection.close()
        print("🔌 Conexión cerrada")
