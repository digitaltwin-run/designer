# Digital Twin Designer - Makefile
# Comprehensive build and development workflow automation

# Variables
NODE_VERSION := $(shell node --version 2>/dev/null || echo "not-installed")
NPM_VERSION := $(shell npm --version 2>/dev/null || echo "not-installed")
PROJECT_NAME := Digital Twin Designer
BUILD_DIR := dist
SRC_DIR := src
PORT := 5173

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color
BOLD := \033[1m

# Default target
.DEFAULT_GOAL := help

##@ Development Commands

.PHONY: help
help: ## Display this help message
	@echo "$(BOLD)$(PROJECT_NAME) - Makefile Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make $(BOLD)<target>$(NC)\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(BOLD)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.PHONY: dev
dev: ## Start development server
	@echo "$(GREEN)🚀 Starting development server on port $(PORT)...$(NC)"
	npm run dev

.PHONY: build
build: check-deps ## Build project for production
	@echo "$(GREEN)🏗️  Building project...$(NC)"
	npm run build
	@echo "$(GREEN)✅ Build completed successfully!$(NC)"

.PHONY: preview
preview: build ## Preview production build
	@echo "$(GREEN)👀 Starting preview server...$(NC)"
	npm run preview

##@ Quality Assurance

.PHONY: lint
lint: ## Run ESLint
	@echo "$(YELLOW)🔍 Running ESLint...$(NC)"
	npm run lint

.PHONY: lint-fix
lint-fix: ## Fix ESLint issues automatically
	@echo "$(YELLOW)🔧 Fixing ESLint issues...$(NC)"
	npm run lint -- --fix

.PHONY: type-check
type-check: ## Run TypeScript type checking
	@echo "$(YELLOW)🔍 Running TypeScript type check...$(NC)"
	npx tsc --noEmit

.PHONY: test
test: ## Run tests (placeholder - to be implemented)
	@echo "$(YELLOW)🧪 Running tests...$(NC)"
	@echo "$(RED)⚠️  Test suite not yet implemented. See TEST.md for manual testing guidelines.$(NC)"
	@echo "$(YELLOW)💡 To implement: npm install --save-dev jest @testing-library/react @testing-library/jest-dom$(NC)"

##@ Project Management

.PHONY: clean
clean: ## Clean build artifacts and node_modules
	@echo "$(YELLOW)🧹 Cleaning build artifacts...$(NC)"
	rm -rf $(BUILD_DIR)
	rm -rf node_modules
	rm -rf .next
	rm -rf coverage
	@echo "$(GREEN)✅ Clean completed!$(NC)"

.PHONY: install
install: ## Install dependencies
	@echo "$(GREEN)📦 Installing dependencies...$(NC)"
	npm install
	@echo "$(GREEN)✅ Dependencies installed!$(NC)"

.PHONY: update
update: ## Update dependencies
	@echo "$(YELLOW)⬆️  Updating dependencies...$(NC)"
	npm update
	@echo "$(GREEN)✅ Dependencies updated!$(NC)"

##@ Validation & Testing

.PHONY: check-deps
check-deps: ## Check if dependencies are installed
	@echo "$(YELLOW)🔍 Checking environment...$(NC)"
	@if [ "$(NODE_VERSION)" = "not-installed" ]; then \
		echo "$(RED)❌ Node.js not found! Please install Node.js$(NC)"; \
		exit 1; \
	fi
	@if [ "$(NPM_VERSION)" = "not-installed" ]; then \
		echo "$(RED)❌ npm not found! Please install npm$(NC)"; \
		exit 1; \
	fi
	@if [ ! -d "node_modules" ]; then \
		echo "$(YELLOW)📦 node_modules not found, installing dependencies...$(NC)"; \
		$(MAKE) install; \
	fi
	@echo "$(GREEN)✅ Environment check passed!$(NC)"
	@echo "$(GREEN)   Node.js: $(NODE_VERSION)$(NC)"
	@echo "$(GREEN)   npm: $(NPM_VERSION)$(NC)"

.PHONY: validate
validate: check-deps type-check build ## Run all validation checks
	@echo "$(GREEN)🎯 Running complete validation suite...$(NC)"
	@echo "$(GREEN)✅ All validation checks passed!$(NC)"

.PHONY: quality
quality: lint type-check ## Run quality checks (linting + type checking)
	@echo "$(GREEN)🎨 Code quality checks completed!$(NC)"

##@ Drag & Drop Testing

.PHONY: test-dragdrop
test-dragdrop: dev-background ## Test drag & drop functionality
	@echo "$(YELLOW)🎯 Testing drag & drop functionality...$(NC)"
	@echo "$(GREEN)Manual Test Instructions:$(NC)"
	@echo "1. 🌐 Open http://localhost:$(PORT) in your browser"
	@echo "2. 🖱️  Drag any component from the left sidebar"
	@echo "3. 📍 Drop it onto the canvas (center area)"
	@echo "4. ✅ Verify the component appears on the canvas"
	@echo "5. 🔍 Check browser console for success logs:"
	@echo "   - '🔧 Canvas element found: true'"
	@echo "   - '✅ Component successfully added to store!'"
	@echo ""
	@echo "$(YELLOW)Press Ctrl+C to stop the dev server when testing is complete$(NC)"

.PHONY: dev-background
dev-background: ## Start dev server in background for testing
	@echo "$(GREEN)🚀 Starting development server for testing...$(NC)"
	npm run dev

##@ Documentation

.PHONY: docs
docs: ## Show documentation links
	@echo "$(BOLD)📚 Project Documentation$(NC)"
	@echo ""
	@echo "$(GREEN)📋 Main Documentation:$(NC)"
	@echo "  • README.md         - Project overview and setup"
	@echo "  • TODO.md          - Development roadmap (v2.0)"
	@echo "  • TEST.md          - Testing guidelines (v2.0)"
	@echo ""
	@echo "$(GREEN)🔧 Technical Documentation:$(NC)"
	@echo "  • src/types.ts     - TypeScript interfaces"
	@echo "  • package.json     - Dependencies and scripts"
	@echo ""
	@echo "$(GREEN)🌐 Live Documentation:$(NC)"
	@echo "  • Development Server: http://localhost:$(PORT)"

.PHONY: status
status: ## Show project status
	@echo "$(BOLD)📊 Project Status$(NC)"
	@echo ""
	@echo "$(GREEN)🏗️  Build Status:$(NC)"
	@if [ -d "$(BUILD_DIR)" ]; then \
		echo "  • Build artifacts: ✅ Present"; \
	else \
		echo "  • Build artifacts: ❌ Missing (run 'make build')"; \
	fi
	@echo ""
	@echo "$(GREEN)📦 Dependencies:$(NC)"
	@echo "  • Node.js: $(NODE_VERSION)"
	@echo "  • npm: $(NPM_VERSION)"
	@if [ -d "node_modules" ]; then \
		echo "  • Dependencies: ✅ Installed"; \
	else \
		echo "  • Dependencies: ❌ Missing (run 'make install')"; \
	fi
	@echo ""
	@echo "$(GREEN)📈 Progress (from TODO.md):$(NC)"
	@echo "  • Alpha Development: ~60% complete"
	@echo "  • Critical Issues: 3 tasks in current sprint"
	@echo "  • Total Tasks: 85 (22 completed, 3 in progress, 60 pending)"

##@ Workflow Shortcuts

.PHONY: quick-start
quick-start: install validate dev ## Quick start: install, validate, and run dev server
	@echo "$(GREEN)🚀 Quick start completed!$(NC)"

.PHONY: ci
ci: install validate ## Continuous Integration workflow
	@echo "$(GREEN)✅ CI workflow completed successfully!$(NC)"

.PHONY: deploy-check
deploy-check: clean install validate ## Pre-deployment validation
	@echo "$(GREEN)🚀 Ready for deployment!$(NC)"

# Hidden targets (don't show in help)
.PHONY: _banner
_banner:
	@echo "$(BOLD)$(GREEN)"
	@echo "╔══════════════════════════════════════════════════════════════╗"
	@echo "║                 Digital Twin Designer                        ║"
	@echo "║                   Makefile Automation                       ║"
	@echo "╚══════════════════════════════════════════════════════════════╝"
	@echo "$(NC)"
