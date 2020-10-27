exports.createText = function (service, status) {
  let text = ''
  const date = new Date()
  if (status === 200) {
    text = `${service.toUpperCase()} est fonctionnelle ! 🚀`
  } else {
    text = `${service.toUpperCase()} a un problème ! 🐛`
  }
  text += `\n\nStatut ${status} à ${date.toLocaleString('fr-FR', {
    timeZone: 'UTC',
  })}`
  return text
}
