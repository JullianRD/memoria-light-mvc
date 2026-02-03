import { hash, verify, Algorithm } from "@node-rs/argon2";
import { User } from "../../models/User.js";
// import {AppEvent} from "../../models/AppEvent.js";
 
/**
 * Configuration Argon2 (OWASP recommendations)
 * ⚠️ À utiliser UNIQUEMENT pour les rehash automatiques
 */
const ARGON2_OPTIONS = {
    algorithm: Algorithm.Argon2id, // ✅ Correct pour @node-rs/argon2
    memoryCost: 65536, // 64 MB
    timeCost: 3, // 3 itérations
    parallelism: 4, // 4 threads
};
 
class AuthController {
 
    async showRegister(req, res) {
        try {
            // Si l'utilisateur est déjà connécté, le rediriger vers la liste des pépites
            if (req.session.userID) {
                return res.redirect("pages/items/index");
            }
 
            res.render("pages/auth/login", {
                title: "Inscription - Memoria",
                error: null,
            });
 
        } catch (error) {
            console.error("Erreur dans showLogin():", error);
            res.status(500).render("pages/errors/500",
                {
                    title: "Erreur",
                    message: "Erreur lors du chargement de la page",
                });
        }
    }
 
    async handleRegister(req, res) {
        try {
            const { email, password, pseudo } = req.body;
            if (!email) {
                console.error('email vide');
            }
            if (!password) {
                console.error('password vide');
            }
            if (!pseudo) {
                console.error('pseudo vide');
            }
 
            // Création des utilisateurs
            const user = await User.create({email, password, pseudo});
            res.redirect('/auth/login')
 
        } catch (error) {
 
            console.error('Error inscription', error);
            res.redirect('/auth/registrer')
 
        }
    }
 
 
 
 
 
    // Affiche la pas de connexion
    async showLogin(req, res) {
        try {
            // Si l'utilisateur est déjà connécté, le rediriger vers la liste des pépites
            if (req.session.userID) {
                return res.redirect("pages/items/index");
            }
 
            res.render("pages/auth/login", {
                title: "Connexion - Memoria",
                error: null,
            });
 
        } catch (error) {
            console.error("Erreur dans showLogin():", error);
            res.status(500).render("pages/errors/500",
                {
                    title: "Erreur",
                    message: "Erreur lors du chargement de la page",
                });
        }
    }
 
 
 
 
};
 
 
 
export default new AuthController();    