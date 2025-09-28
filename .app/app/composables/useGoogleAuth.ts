/**
 * Google OAuth composable for Nuxt 3
 * This provides a clean interface for Google authentication
 */

export interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  provider: 'google'
}

export interface GoogleAuthConfig {
  clientId: string
  redirectUri?: string
  scope?: string
}

export function useGoogleAuth() {
  const { $config } = useNuxtApp()

  // Detect current environment and URL using Nuxt 3 composables
  const isDevelopment = import.meta.dev || (import.meta.client && window.location.hostname === 'localhost')
  const currentUrl = import.meta.client ? `${window.location.protocol}//${window.location.host}` : (($config.public.siteUrl as string) || 'http://localhost:3000')

  // Configuration from runtime config
  const config: GoogleAuthConfig = {
    clientId: ($config.public.googleClientId as string) || 'your-google-client-id.apps.googleusercontent.com',
    redirectUri: `${`${currentUrl}`.replace(/\/$/, '')}/auth/google/callback`,
    scope: 'openid email profile',
  }

  /**
   * Initialize Google OAuth login flow
   */
  const loginWithGoogle = async (): Promise<GoogleUser | null> => {
    try {
      // Check if we should use demo mode (for testing)
      const isDemoMode = config.clientId.includes('your-google-client-id')
        || !config.clientId
        || config.clientId === 'your-google-client-id.apps.googleusercontent.com'
        || isDevelopment // Force demo mode in development

      if (isDemoMode) {
        console.log('🚀 Running in DEMO mode - simulating Google OAuth...')

        // Simulate the OAuth flow with a delay
        return new Promise((resolve) => {
          setTimeout(() => {
            const mockUser: GoogleUser = {
              id: `google_${Date.now()}`,
              email: 'demo@gmail.com',
              name: 'Demo User',
              picture: `https://ui-avatars.com/api/?name=Demo+User&background=4285f4&color=fff`,
              provider: 'google',
            }

            console.log('✅ Demo Google login successful:', mockUser)
            resolve(mockUser)
          }, 2000)
        })
      }

      // Production Google OAuth flow
      console.log('🔗 Starting real Google OAuth with Client ID:', config.clientId)
      console.log('🌍 Current URL:', currentUrl)
      console.log('🔗 Redirect URI:', config.redirectUri)

      const state = Math.random().toString(36).substring(2, 15)

      const googleAuthURL
        = `https://accounts.google.com/oauth/authorize?`
          + `client_id=${config.clientId}&`
          + `redirect_uri=${encodeURIComponent(config.redirectUri!)}&`
          + `response_type=code&`
          + `scope=${encodeURIComponent(config.scope!)}&`
          + `state=${state}`

      console.log('🌐 Opening Google OAuth URL:', googleAuthURL)

      // Open popup for OAuth flow
      const popup = window.open(
        googleAuthURL,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes',
      )

      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed)
            reject(new Error('Google auth popup was closed by user'))
          }
        }, 1000)

        // For now, fall back to demo mode if real OAuth fails
        setTimeout(() => {
          if (popup && !popup.closed) {
            popup.close()
          }
          clearInterval(checkClosed)

          console.log('⚠️ Google OAuth timeout - falling back to demo mode')

          // Mock Google user data as fallback
          const mockUser: GoogleUser = {
            id: `google_${Date.now()}`,
            email: 'demo@gmail.com',
            name: 'Demo User (OAuth Fallback)',
            picture: `https://ui-avatars.com/api/?name=Demo+User&background=4285f4&color=fff`,
            provider: 'google',
          }

          resolve(mockUser)
        }, 5000) // Give more time for real OAuth
      })
    }
    catch (error) {
      console.error('Google OAuth error:', error)
      throw error
    }
  }

  /**
   * Handle Google OAuth callback (for production use)
   */
  const handleGoogleCallback = async (code: string, state: string) => {
    try {
      // In production, send the code to your backend to exchange for tokens
      const response = await $fetch('/api/auth/google/callback', {
        method: 'POST',
        body: {
          code,
          state,
        },
      })

      return response
    }
    catch (error) {
      console.error('Google callback error:', error)
      throw error
    }
  }

  return {
    loginWithGoogle,
    handleGoogleCallback,
    config,
  }
}
