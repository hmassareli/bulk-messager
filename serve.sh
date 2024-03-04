echo "###########"
echo "# Building frontend to backend ./public and serving backend";
echo "###########"
cd ./frontend && npm run build -- --outDir=../backend/public --emptyOutDir && 
cd ../backend && npm run serve