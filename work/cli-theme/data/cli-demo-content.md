# CLI Prototype Demo Content (exact)

Source: component "Content Area" (node 2180:644) and prototype frame "Opencode CLI — With sidebar" (node 2154:1360), extracted 2026-07-26. All text verbatim, including em dashes, which are part of the designed content.

## Conversation flow (in order)

1. Thought row: `+ Thought:263ms`
2. User query (Query Bar): `Explain REST APIs using markdown with headings, bullet points, bold text, inline code, and a code block`
3. Thought row: `+ Thought:263ms`
4. Assistant response, markdown-rendered:

   Heading: `REST APIs`

   Paragraph: `REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on a stateless, client-server protocol — almost always HTTP.`

   Heading: `Core Principles`

   Bullets:
   - `— Stateless — each request from a client contains all necessary information; the server does not store session state`
   - `— Client-Server — separation of concerns; the UI is decoupled from data storage`
   - `— Cacheable — responses must define themselves as cacheable or not`
   - `— Uniform Interface — consistent resource identification via URIs`

5. Thought row: `+ Thought:263ms`
6. User query (Query Bar): `Write a Python function that fetches data from an API and handles errors`
7. Thought row: `+ Thought:263ms`
8. Code block (header `# Wrote api_fetcher.py`, line numbers 1-18):

```python
import requests


def fetch_data(url, params=None, timeout=10):
    try:
        response = requests.get(url, params=params, timeout=timeout)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        raise RuntimeError(f"Request timed out after {timeout}s: {url}")
    except requests.exceptions.HTTPError as e:
        status = e.response.status_code
        raise RuntimeError(f"HTTP {status} error for {url}: {e}")
    except requests.exceptions.ConnectionError:
        raise RuntimeError(f"Connection failed: {url}")
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Request failed: {url} - {e}")
```

9. Heading: `HTTP Methods (Verbs)`

10. Table "HTTP Methods Table":

| Method | Action |
|---|---|
| GET | Retrieve |
| POST | Create |
| PUT | Update |
| DELETE | Remove |

11. Heading: `Example: CRUD on Users`
12. Inline code chip: `TIMEOUT = 10`
13. Second code block ("Code Block"):

```python
def fetch_api(
    url: str,
    params: Optional[dict[str, str]] = None,
    headers: Optional[dict[str, str]] = None,
    timeout: int = TIMEOUT,
) -> dict[str, Any]:
    try:
        resp = requests.get(url, params=params, headers=headers, timeout=timeout)
        resp.raise_for_status()
    except requests.exceptions.Timeout:
        raise RuntimeError(f"Request timed out after {timeout}s: {url}")
    except requests.exceptions.HTTPError:
        status = resp.status_code
        try:
            detail = resp.json()
        except Exception:
            detail = resp.text[:500]
        raise RuntimeError(f"HTTP {status} from {url}: {detail}")
    except requests.exceptions.ConnectionError:
        raise RuntimeError(f"Connection failed: {url}")
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Request error: {url} — {e}")

    try:
        return resp.json()
    except requests.exceptions.JSONDecodeError as e:
        raise RuntimeError(f"Invalid JSON from {url}: as {e}")
        return None


def fetch_api_safe(
    url: str,
    params: Optional[dict[str, str]] = None,
    headers: Optional[dict[str, str]] = None,
    timeout: int = TIMEOUT,
) -> Optional[dict[str, Any]]:
    try:
        return fetch_api(url, params=params, headers=headers, timeout=timeout)
    except RuntimeError as e:
        print(f"Error: {e}")
        return None
```

14. `Key features:`
    - `— Typed with function signatures and Optional/Any`
    - `— Raises exceptions (fetch_api) — lets the caller decide how to handle errors`
    - `— Silent fallback (fetch_api_safe) — wraps the first and returns None on failure`
    - `— Rich error messages — includes URL, status code, and response body in HTTP errors`
    - `— Body truncation — limits error detail to 500 chars to avoid blasting logs`
15. Closing line: `Would you like me to write this to a file?`

## Status bar (component "status-left", node 2154:1294)

`■` `Build` `·` `Big Pickle` `·` `15.0s`

## Sidebar (component "Sidebar", node 2154:1408)

- `Greeting`
- `Context` / `8,468 tokens` / `4$ used` / `$0.00 spent`
- `LSP` / `LSP are disabled`
- Card `Gettings started` (verbatim, includes typo): `OpenCode includes free models so you can start immediately.` / `Connect from 75+ providers to use other model, including Claude, GPT, Gemini etc` / footer: `Connect provider` + `/connect`
- `/〜`
- Version row: `OpenCode 1.16.2`
