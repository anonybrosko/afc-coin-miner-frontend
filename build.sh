if git add .; then
  if git commit -m "${1}"; then
    git push
  fi
fi

if npm run build; then
  npm run deploy
fi
