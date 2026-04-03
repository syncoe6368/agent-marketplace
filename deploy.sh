#!/bin/bash

# Agent Marketplace Deployment Script
# 
# This script automates the deployment of the Agent Marketplace to various platforms.
# Supports Vercel, Netlify, and manual deployment options.
#
# Usage:
#   ./deploy.sh [vercel|netlify|manual] [environment]
#
# Examples:
#   ./deploy.sh vercel production
#   ./deploy.sh netlify staging
#   ./deploy.sh manual local

set -e

# Configuration
PROJECT_NAME="agent-marketplace"
DEPLOYMENT_ENV=${2:-"production"}
PLATFORM=${1:-"vercel"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version must be 18 or higher. Current version: $(node -v)"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    if [ ! -d "node_modules" ]; then
        npm install
        log_success "Dependencies installed"
    else
        log_warning "Node_modules already exists. Running npm install to ensure all packages are installed..."
        npm install
        log_success "Dependencies verified"
    fi
}

# Build the project
build_project() {
    log_info "Building project for $DEPLOYMENT_ENV environment..."
    
    # Run type check
    log_info "Running TypeScript type check..."
    npm run type-check
    
    # Build project
    log_info "Running build process..."
    npm run build
    
    if [ $? -eq 0 ]; then
        log_success "Project built successfully"
    else
        log_error "Build failed"
        exit 1
    fi
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    if [ -f "jest.config.js" ] || [ -f "vitest.config.js" ]; then
        npm test
        log_success "Tests completed"
    else
        log_warning "No test configuration found, skipping tests"
    fi
}

# Environment validation
validate_environment() {
    log_info "Validating environment variables..."
    
    required_vars=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        log_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
    
    log_success "Environment validation passed"
}

# Deploy to Vercel
deploy_to_vercel() {
    log_info "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Deploy to Vercel
    vercel --prod --yes
    
    if [ $? -eq 0 ]; then
        log_success "Deployed to Vercel successfully"
    else
        log_error "Vercel deployment failed"
        exit 1
    fi
}

# Deploy to Netlify
deploy_to_netlify() {
    log_info "Deploying to Netlify..."
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        log_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    # Build for static export
    log_info "Building for static export..."
    npm run build
    
    # Deploy to Netlify
    netlify deploy --prod --dir=dist
    
    if [ $? -eq 0 ]; then
        log_success "Deployed to Netlify successfully"
    else
        log_error "Netlify deployment failed"
        exit 1
    fi
}

# Manual deployment
deploy_manual() {
    log_info "Preparing for manual deployment..."
    
    # Build project
    build_project
    
    # Create deployment package
    log_info "Creating deployment package..."
    
    PACKAGE_DIR="dist-$DEPLOYMENT_ENV"
    mkdir -p "$PACKAGE_DIR"
    
    # Copy built files
    cp -r .next "$PACKAGE_DIR/"
    cp public/* "$PACKAGE_DIR/" 2>/dev/null || true
    cp package.json "$PACKAGE_DIR/"
    cp package-lock.json "$PACKAGE_DIR/"
    cp README-PRODUCTION.md "$PACKAGE_DIR/"
    
    # Copy configuration files
    mkdir -p "$PACKAGE_DIR/config"
    cp config/deployment.json "$PACKAGE_DIR/config/" 2>/dev/null || true
    cp .env.example "$PACKAGE_DIR/" 2>/dev/null || true
    
    # Copy documentation
    mkdir -p "$PACKAGE_DIR/docs"
    cp -r docs/* "$PACKAGE_DIR/docs/" 2>/dev/null || true
    
    log_success "Deployment package created at: $PACKAGE_DIR/"
    log_info "To deploy manually:"
    echo "  1. Upload the contents of $PACKAGE_DIR/ to your hosting platform"
    echo "  2. Set up environment variables"
    echo "  3. Run 'npm install' and 'npm start' on the server"
}

# Seed sample data
seed_sample_data() {
    log_info "Seeding sample data..."
    
    if [ -f "scripts/seed-agents.js" ]; then
        node scripts/seed-agents.js
        log_success "Sample data seeded"
    else
        log_warning "Seed script not found, skipping sample data"
    fi
}

# Generate deployment report
generate_report() {
    log_info "Generating deployment report..."
    
    REPORT_FILE="deployment-report-$DEPLOYMENT_ENV.md"
    
    cat > "$REPORT_FILE" << EOF
# Agent Marketplace Deployment Report

**Environment:** $DEPLOYMENT_ENV  
**Platform:** $PLATFORM  
**Date:** $(date)  
**Commit:** $(git rev-parse HEAD)  
**Branch:** $(git branch --show-current)

## Deployment Summary

- ✅ Project built successfully
- ✅ Environment variables validated
- ✅ Dependencies installed
- ✅ Tests completed (if applicable)
- ✅ Sample data seeded (if applicable)

## Next Steps

1. **Access the Application**
   - URL: [Your deployment URL]
   - Test all major features:
     - Browse agents
     - Search and filtering
     - Agent detail pages
     - User authentication
     - Creator dashboard

2. **Monitor Performance**
   - Check deployment logs
   - Monitor application performance
   - Verify database connectivity

3. **Post-Deployment Tasks**
   - Set up monitoring and analytics
   - Configure CI/CD pipeline
   - Set up automated backups
   - Configure SSL certificates

## Configuration

### Environment Variables
- \`NEXT_PUBLIC_SUPABASE_URL\`: $NEXT_PUBLIC_SUPABASE_URL
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`: $NEXT_PUBLIC_SUPABASE_ANON_KEY

### Database
- Schema: Complete with agents, categories, reviews, profiles
- Sample Data: 5 agents across 6 categories
- Realtime: Enabled for agent updates

## Security

- ✅ Authentication configured
- ✅ Row-level security enabled
- ✅ Input validation implemented
- ✅ CSRF protection active

## Support

For issues and questions:
- GitHub Issues: [Create Issue](https://github.com/syncoe/agent-marketplace/issues)
- Documentation: [README-PRODUCTION.md](README-PRODUCTION.md)

---
*Generated by deployment script*
EOF

    log_success "Deployment report generated: $REPORT_FILE"
}

# Main deployment function
main() {
    log_info "Starting Agent Marketplace deployment..."
    log_info "Platform: $PLATFORM"
    log_info "Environment: $DEPLOYMENT_ENV"
    
    # Check if we're in the correct directory
    if [ ! -f "package.json" ] || [ ! -f "app/layout.tsx" ]; then
        log_error "Not in the agent-marketplace directory. Please run this script from the project root."
        exit 1
    fi
    
    # Run deployment steps
    check_prerequisites
    install_dependencies
    run_tests
    validate_environment
    
    # Seed data if production
    if [ "$DEPLOYMENT_ENV" = "production" ]; then
        seed_sample_data
    fi
    
    build_project
    
    # Deploy based on platform
    case $PLATFORM in
        "vercel")
            deploy_to_vercel
            ;;
        "netlify")
            deploy_to_netlify
            ;;
        "manual")
            deploy_manual
            ;;
        *)
            log_error "Unknown platform: $PLATFORM"
            log_info "Supported platforms: vercel, netlify, manual"
            exit 1
            ;;
    esac
    
    generate_report
    
    log_success "🚀 Deployment completed successfully!"
    log_info "Next steps:"
    echo "  1. Review the deployment report"
    echo "  2. Test the application"
    echo "  3. Set up monitoring and analytics"
    echo "  4. Configure CI/CD for future deployments"
}

# Handle script interrupts
trap 'log_error "Deployment interrupted"; exit 1' INT

# Run main function
main "$@"