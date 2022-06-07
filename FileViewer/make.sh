cd wwwroot && rm -rf * && cd ../UserInter* && npm run build && mv -f build/*.* ../wwwroot/ && mv -f build/static/ ../wwwroot/  &&  cd .. && dotnet run
