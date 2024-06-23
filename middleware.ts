import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/', '/api/webhook/clerk', '/onboarding'
]);

export default clerkMiddleware((auth, request)=>{
    if(isPublicRoute(request)){
        auth().protect();
    }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};