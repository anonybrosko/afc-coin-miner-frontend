if npm run build; then
  if npm run deploy; then
    if git add .; then
      if git commit -m "${1}"; then
        git push
      fi
    fi
  fi
fi
