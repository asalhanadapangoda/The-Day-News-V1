/**
 * Validates required environment variables on startup
 * Exits process if any required variables are missing
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
];

const optionalEnvVars = [
  'PORT',
  'CLIENT_URL',
  'GROQ_API_KEY',
  'RESEND_API_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease add these to your server/.env file\n');
    process.exit(1);
  }
  
  // Warn about missing optional but recommended vars
  const missingOptional = optionalEnvVars.filter(varName => !process.env[varName]);
  if (missingOptional.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('\n⚠️  Missing optional environment variables (some features may not work):');
    missingOptional.forEach(varName => {
      console.warn(`   - ${varName}`);
    });
    console.warn('');
  }
  
  console.log('✅ Environment variables validated');
};

export default validateEnv;

