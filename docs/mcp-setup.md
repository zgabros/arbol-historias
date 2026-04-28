# Configuración del Servidor MCP de Supabase

Este proyecto soporta el **Model Context Protocol (MCP)** de Supabase, lo que permite que herramientas de IA (como Cursor, Claude Desktop o Antigravity) interactúen directamente con la base de datos y la infraestructura del proyecto.

## Requisitos Previos

1.  **Personal Access Token (PAT):**
    - Ve a tu Dashboard de Supabase.
    - Navega a **Account > Access Tokens**.
    - Genera un nuevo token y guárdalo de forma segura.
2.  **Project Ref:**
    - Lo puedes encontrar en la URL de tu proyecto en Supabase (ej: `https://supabase.com/dashboard/project/tu-project-ref`) o en tu archivo `.env.local` como parte de la URL de Supabase.

## Configuración en Herramientas de IA

### 1. Cursor
Crea o edita el archivo `.cursor/mcp.json` en la raíz del proyecto (no lo subas al repositorio):

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "TU_TOKEN_AQUÍ",
        "--project-ref",
        "TU_PROJECT_REF_AQUÍ"
      ]
    }
  }
}
```

### 2. Claude Desktop
Añade lo siguiente a tu archivo `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "TU_TOKEN_AQUÍ",
        "--project-ref",
        "TU_PROJECT_REF_AQUÍ"
      ]
    }
  }
}
```

## Herramientas Disponibles

Una vez configurado, la IA tendrá acceso a:
- `list_tables`: Listar todas las tablas.
- `get_table_schema`: Ver la estructura de una tabla.
- `run_query`: Ejecutar consultas SQL (SELECT, INSERT, etc.).
- `list_functions`: Listar Edge Functions.
- `get_logs`: Ver logs del proyecto.

> [!WARNING]
> Nunca compartas ni subas tu Personal Access Token al repositorio. El archivo `.env.local` y los archivos de configuración local deben estar en el `.gitignore`.
