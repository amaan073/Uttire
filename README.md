### 🔐 Authentication

This project uses **JWT-based authentication**, where tokens are stored in `localStorage`.

> ⚠️ **Disclaimer:**  
> For simplicity and ease of implementation, this demo app stores JWTs in `localStorage`. While convenient for development, this method is **not recommended for production**, as it is vulnerable to XSS attacks.

> ✅ In production environments, the more secure and modern approach is to use **HttpOnly secure cookies** (often combined with access/refresh tokens).  
> This project prioritizes developer clarity and debugging ease over strict security to better showcase backend-auth logic.

> 💡 I’m aware of both methods and chose this one deliberately to keep the authentication flow transparent for learning and demonstration purposes.
