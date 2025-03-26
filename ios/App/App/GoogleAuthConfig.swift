import Foundation

struct GoogleAuthConfig {
    // Google Sign-In client ID for iOS
    static let clientID = "308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com"
    
    // Redirect URI for OAuth flows
    static let redirectURI = "com.googleusercontent.apps.308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2:/oauth2redirect"
    
    // Supabase callback URL
    static let supabaseCallbackUrl = "https://gnvlzzqtmxrfvkdydxet.supabase.co/auth/v1/callback"
}
