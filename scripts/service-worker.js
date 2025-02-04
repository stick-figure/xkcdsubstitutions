const REPLACEMENTS = [
  // https://xkcd.com/37 hyphen
  ["sweet ass car"                        , "sweet ass-car"],
  // https://xkcd.com/148 mispronouncing
  ["website"                              , "wobsite"],
  ["blog"                                 , "blag"],
  ["airport"                              , "airpart"],
  // https://xkcd.com/819 five-minute comics: part one
  ["I think that"                         , "I saw in a study once that said"],
  // https://xkcd.com/1004 batman
  ["batman"                               , "a man dressed like a bat"],
  // https://xkcd.com/1025 tumblr
  ["would be a good name for a band"      , "dot tumblr dot com"],
  // https://xkcd.com/1031 s/keyboard/leopard
  ["keyboards"                            , "leopards"],
  ["keyboard"                             , "leopard"],
  // https://xkcd.com/1288 substitutions
  ["witnesses"                            , "these dudes I know"],
  ["allegedly"                            , "kinda probably"],
  ["new study"                            , "Tumblr post"],
  ["rebuild"                              , "avenge"],
  ["rebuilt"                              , "avenged"],
  ["space"                                , "spaaace"],
  ["google glass"                         , "virtual boy"],
  ["smartphone"                           , "Pokédex"],
  ["electric"                             , "atomic"],
  ["senator"                              , "elf-lord"], 
  ["car"                                  , "cat"],
  ["election"                             , "eating contest"],
  ["congressional leader"                 , "river spirit"],
  ["homeland security"                    , "homestar runner"], 
  ["could not be reached for comment"     , "is guilty and everyone knows it"],
  // https://xkcd.com/1418 horse
  ["force"                                , "horse"],
  // https://xkcd.com/1625 substitutions 2
  ["debate"                               , "dance-off"],
  ["self-driving"                         , "uncontrollably swerving"],
  ["poll"                                 , "psychic reading"],
  ["candidate"                            , "airbender"],
  ["drone"                                , "dog"],
  ["vows to"                              , "probably won't"],
  ["at-large"                             , "very large"],
  ["successfully"                         , "suddenly"],
  ["expand"                               , "physically expand"],
  ["first degree"                         , "friggin' awful"],
  ["second degree"                        , "friggin' awful"],
  ["third degree"                         , "friggin' awful"],
  ["an unknown number"                    , "like hundreds"],
  ["frontrunner"                          , "bladerunner"],
  ["global(ly)?"                          , "spherical"],
  ["year"                                 , "minute"],
  ["minute"                               , "year"],
  ["no[ -]indication"                     , "lots of signs"],
  ["urged restraint by"                   , "drunkenly egged on"],
  ["horsepower"                           , "tons of horsemeat"],
  // https://xkcd.com/1679 substitutions 3
  ["gaffe"                                , "magic spell"],
  ["ancient"                              , "haunted"],
  ["star-studded"                         , "blood-soaked"],
  ["remains? to be seen"                  , "will never be known"],
  ["silver bullet"                        , "way to kill werewolves"],
  ["subway system"                        , "tunnels I found"],
  ["surprising"                           , "surprising (but not to me)"],
  ["war of words"                         , "interplanetary war"],
  ["tension"                              , "sexual tension"],
  ["cautiously optimistic"                , "delusional"],
  ["Doctor Who"                           , "The Big Bang Theory"],
  ["win votes"                            , "find Pokémon"],
  ["behind the headlines"                 , "beyond the grave"],
  ["email"                                , "poem"],
  ["facebook post"                        , "poem"],
  ["tweet"                                , "poem"],
  ["Facebook CEO"                         , "this guy"],
  ["latest"                               , "final"],
  ["disrupt"                              , "destroy"],
  ["meeting"                              , "ménage à trois"],
  ["scientists"                           , "Channing Tatum and his friends"],
  ["you won't believe"                    , "I'm really sad about"],
  // https://xkcd.com/1677 contrails
  ["contrail"                             , "chemtrail"],
  ["astonomy"                             , "astrology"],
  // https://xkcd.com/1689 my friend catherine
  ["my cat"                               , "my friend Catherine"],
  // https://xkcd.com/1704 gnome ann
  ["no man"                               , "Gnome Ann"],
  // https://xkcd.com/2252 parenthetical names
  ["sonic the hedgehog"                   , "Sonic (the Hedgehog)"],
  ["popeye the sailor man"                , "Popeye (the Sailor Man)"],
  ["jack the ripper"                      , "Jack (the Ripper)"],
  ["battle of midway"                     , "Battle (of Midway)"],
  //  ["(\\w+[ -]+)(the[ -]+\\w+)"            , "($2)"],
  // https://xkcd.com/2683 fan theories
  ["hypothesize"                          , "fan theorize"],
  ["hypotheses"                           , "fan theories"],
  ["hypothesis"                           , "fan theory"],
  // https://xkcd.com/2871 definitely
  ["definetly"                            , "almost definitely"],
  ["definately"                           , "probably"],
  ["definatly"                            , "probably not"],
  ["defenitely"                           , "not telling (it's a surprise)"],
  ["defintely"                            , "per the prophecy"],
  ["definetely"                           , "definitely, maybe"],
  ["definantly"                           , "to be decided by coin toss"],
  ["defanitely"                           , "in one universe out of 14 million"],
  ["defineatly"                           , "only the gods know"],
  ["definitly"                            , "unless someone cute shows up"],
  ["defiantly"                            , "defiantly"],
  ["definitely"                           , "definitively"],
////  ["definitively"                         , "definitely"],
];

const DELUXE_REPLACEMENTS = [
  // https://xkcd.com/37 hyphen
  ["((?<=\\w)|\\W|\\s)+ass[\\s]+(?=.)"    , " ass-"],
  // https://xkcd.com/148 mispronouncing
  ["website(s)?"                          , "wobsite$1"],
  ["blog(ged|gers?|s)?"                   , "blag$1"],
  ["airport(s)?"                          , "airpart$1"],
  // https://xkcd.com/819 five-minute comics: part one
  ["I think that"                         , "I saw in a study once that said"],
  // https://xkcd.com/1004 batman
  ["batman"                               , "a man dressed like a bat"],
  // https://xkcd.com/1025 tumblr
  ["would be a good name for a band"      , "dot tumblr dot com"],
  // https://xkcd.com/1031 s/keyboard/leopard
  ["keyboard(s)?"                         , "leopard$1"],
  // https://xkcd.com/1288 substitutions
  ["witnesses"                            , "these dudes I know"],
  ["allegedly"                            , "kinda probably"],
  ["new stud(ie(s)|y)"                    , "Tumblr post$2"],
  ["rebuild(s)?"                          , "avenge$1"],
  ["rebuild(ing|er)"                      , "aveng$1"],
  ["rebuilt"                              , "avenged"],
  ["space(s)?"                            , "spaaace$1"],
  ["google glass(e(s))?"                  , "virtual boy$2"],
  ["smartphon((es)|e)"                    , "Pokédex$2"],
  ["electric"                             , "atomic"],
  ["senator(s)?"                          , "elf-lord$1"], 
  ["car(s)?"                              , "cat$1"],
  ["election(s)?"                         , "eating contest$1"],
  ["congressional leader(s)?"             , "river spirit$1"],
  ["homeland security"                    , "homestar runner"], 
  ["could not be reached for comment"     , "is guilty and everyone knows it"],
  // https://xkcd.com/1418 horse
  ["force(s)?"                            , "horse$1"],
  // https://xkcd.com/1625 substitutions 2
  ["debat(er|ing|ed?|(s)?)"               , "dance-off$1"],
  ["self([ -])driving"                    , "uncontrollably$2swerving"],
  ["poll(s)?"                             , "psychic reading$1"],
  ["candidate(s)?"                        , "airbender$1"],
  ["drone(s)?"                            , "dog$1"],
  ["vow(s|ed|ing)? to"                    , "probably won't"],
  ["at[ -]large"                          , "very large"],
  ["successfully"                         , "suddenly"],
  ["expand(ing|ed|s)?"                    , "physically expand$1"],
  ["(first|second|third)([ -])degree"     , "friggin'$2awful"],
  ["an unknown number"                    , "like hundreds"],
  ["front([ -])?runner"                   , "blade$1runner"],
  ["global(ly)?"                          , "spherical$1"],
  ["year(s)?"                             , "minute$1"],
  ["minute(s)?"                           , "year$1"],
  ["no[ -]indication"                     , "lots of signs"],
  ["urged restraint by"                   , "drunkenly egged on"],
  ["horsepower"                           , "tons of horsemeat"],
  // https://xkcd.com/1679 substitutions 3
  ["gaffe"                                , "magic spell"],
  ["ancient"                              , "haunted"],
  ["star([ -])studded"                    , "blood$1soaked"],
  ["remains? to be seen"                  , "will never be known"],
  ["silver[ -]bullet(s)?"                 , "way$1 to kill werewolves"],
  ["subway system(s)?"                    , "tunnels I found"],
  ["surpris(ed?|ing(ly)?)"                , "surpris$1 (but not to me)"],
  ["war[ -]of[ -]words"                   , "interplanetary war"],
  ["tension(s)?"                          , "sexual tension$1"],
  ["cautiously optimistic"                , "delusional"],
  ["Doctor Who"                           , "The Big Bang Theory"],
  ["win (.* )?votes"                      , "find $1Pokémon"],
  ["behind([ -])the([ -])headlines?"      , "beyond$1the$2grave"],
  ["(email|facebook post|tweet)(s)?"      , "poem$2"],
  ["Facebook CEO"                         , "this guy"],
  ["latest"                               , "final"],
  ["disrupt(ed|ing)?"                     , "destroy$1"],
  ["meeting(s)?"                          , "ménage$1 à trois"],
  ["scientists"                           , "Channing Tatum and his friends"],
  ["you won't believe"                    , "I'm really sad about"],
  // https://xkcd.com/1677 contrails
  ["contrail(s)?"                         , "chemtrail$1"],
  ["astonom(ers?|y)"                      , "astrolog$1"],
  // https://xkcd.com/1689 my friend catherine
  ["my cat"                               , "my friend Catherine"],
  // https://xkcd.com/1704 gnome ann
  ["no man"                               , "Gnome Ann"],
  // https://xkcd.com/2252 parenthetical names
  ["sonic the hedgehog"                   , "Sonic (the Hedgehog)"],
  ["popeye the sailor([ -]?man)?"         , "Popeye (the Sailor$1)"],
  ["jack the ripper"                      , "Jack (the Ripper)"],
  ["(the )?battle of midway"              , "$1Battle (of Midway)"],
////  ["(\\w+[ -]+)(the[ -]+\\w+)"            , "$1($2)"],
  // https://xkcd.com/2683 fan theories
  ["hypothes(i(ze)|(es))"                 , "fan theori$2$3"],
  ["hypothesis"                           , "fan theory"],
  // https://xkcd.com/2871 definitely
  ["definetly"                            , "almost definitely"],
  ["definately"                           , "probably"],
  ["definatly"                            , "probably not"],
  ["defenitely"                           , "not telling (it's a surprise)"],
  ["defintely"                            , "per the prophecy"],
  ["definetely"                           , "definitely, maybe"],
  ["definantly"                           , "to be decided by coin toss"],
  ["defanitely"                           , "in one universe out of 14 million"],
  ["defineatly"                           , "only the gods know"],
  ["definitly"                            , "unless someone cute shows up"],
  ["defiantly"                            , "defiantly"],
  ["definitely"                           , "definitively"],
////  ["definitively"                         , "definitely"],
];

const MATCH_WHOLE_WORD = true;
const CASE_INSENSITIVE = true;
const AUTO_CAPITALIZE = true;
const ESCAPE_REGEX_CHARACTERS = false;
const WRAP_SUBSTITUTIONS = true;
const BLACKLIST = [];
const REVEAL_TYPE = 1;
const WRAPPER_PROPERTIES = "";

function resetPreferences() {
  chrome.storage.local.set({'replacements': DELUXE_REPLACEMENTS});
  chrome.storage.local.set({'matchWholeWord': MATCH_WHOLE_WORD});
  chrome.storage.local.set({'caseInsensitive': CASE_INSENSITIVE});
  chrome.storage.local.set({'autoCapitalize': AUTO_CAPITALIZE});
  chrome.storage.local.set({'escapeRegexCharacters': ESCAPE_REGEX_CHARACTERS});
  chrome.storage.local.set({'wrapSubstitutions': WRAP_SUBSTITUTIONS});
  chrome.storage.local.set({'revealType': REVEAL_TYPE});
  chrome.storage.local.set({'wrapperProperties': WRAPPER_PROPERTIES});
  chrome.storage.local.set({'blacklist': BLACKLIST});
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== "install" && details.reason !== "update") return;
  
  
  if (details.reason == "install") {
    resetPreferences();
  }  
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.greeting === 'resetPreferences') {
    resetPreferences();
    sendResponse();
    return true;
  } 
  
  if (message.greeting === 'getMatchWholeWord') {
    chrome.storage.local.get(['matchWholeWord'], (response) => {
      sendResponse(response);
      return true;
    });
    return true;
  } 
  if (message.greeting === 'setMatchWholeWord') {
    chrome.storage.local.set({'matchWholeWord': message.matchWholeWord});
    sendResponse(true);
    return true;
  }
  if (message.greeting === 'getCaseInsensitive') {
    chrome.storage.local.get(['caseInsensitive'], (response) => {
      sendResponse(response);
      return true;
    });
    return true;
  } 
  if (message.greeting === 'setCaseInsensitive') {
    chrome.storage.local.set({'caseInsensitive': message.caseInsensitive});
    sendResponse(true);
    return true;
  }
  if (message.greeting === 'getAutoCapitalize') {
    chrome.storage.local.get(['autoCapitalize'], (response) => {
      sendResponse(response);
      return true;
    });
    return true;
  } 
  if (message.greeting === 'setAutoCapitalize') {
    chrome.storage.local.set({'autoCapitalize': message.autoCapitalize});
    sendResponse(true);
    return true;
  }
  if (message.greeting === 'getEscapeRegexCharacters') {
    chrome.storage.local.get(['escapeRegexCharacters'], (response) => {
      sendResponse(response);
      return true;
    });
    return true;
  } 
  if (message.greeting === 'setEscapeRegexCharacters') {
    chrome.storage.local.set({'escapeRegexCharacters': message.escapeRegexCharacters});
    sendResponse(true);
    return true;
  }
  if (message.greeting === "getWrapSubstitutions") {
    chrome.storage.local.get(["wrapSubstitutions"], (response) => {
      sendResponse(response);
      return true;
    });
    return true;
  }
  if (message.greeting === "setWrapSubstitutions") {
    chrome.storage.local.set({"wrapSubstitutions": message.wrapSubstitutions}, () => {
      sendResponse(true);
      return true;
    });
    return true;
  }
  if (message.greeting === "getRevealType") {
    chrome.storage.local.get(["revealType"], (response) => {
      sendResponse(response);
      return true;
    });
    return true;
  }
  if (message.greeting === "setRevealType") {
    chrome.storage.local.set({"revealType": message.revealType}, () => {
      sendResponse(true);
      return true;
    });
    return true;
  }
  if (message.greeting === "getWrapperProperties") {
    chrome.storage.local.get(["wrapperProperties"], (response) => {
      sendResponse(response);
      return true;
    });
    return true;
  }
  if (message.greeting === "setWrapperProperties") {
    chrome.storage.local.set({"wrapperProperties": message.wrapperProperties}, () => {
      sendResponse(true);
      return true;
    });
    return true;
  }
  if (message.greeting === "getReplacements") {
    chrome.storage.local.get(["replacements"], (response) => {
      sendResponse(response);
      return true;
    });
    return true;
  }
  if (message.greeting === "setReplacements") {
    chrome.storage.local.set({"replacements": message.replacements.filter((a) => a[0].length > 0)}, () => {
      sendResponse(true);
      return true;
    });
    return true;
  }
  if (message.greeting === "getBlacklist") {
    chrome.storage.local.get(['blacklist'], (response) => {
      sendResponse(response);
      return true;
    });
    return true;
  }
  if (message.greeting === "setBlacklist") {
    chrome.storage.local.set({"blacklist": [...new Set(message.blacklist.filter((a) => a.length > 0))]}, () => {
      sendResponse(true);
      return true;
    });
    return true;
  }
});