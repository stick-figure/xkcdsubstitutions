const REPLACEMENTS = {
  "I think that"                     : "I saw in a study once that said",
	"keyboard"                         : "leopard",
	"witnesses"                        : "these dudes I know",
	"allegedly"                        : "kinda probably",
	"new study"                        : "Tumblr post",
	"rebuild"                          : "avenge",
	"space"                            : "spaaace",
	"google glass"                     : "virtual boy",
	"smartphone"                       : "Pokédex",
	"electric"                         : "atomic",
	"senator"                          : "elf-lord", 
	"car"                              : "cat",
	"election"                         : "eating contest",
	"congressional leader"             : "river spirit",
	"congressional leaders"            : "river spirits",
	"homeland security"                : "homestar runner", 
	"could not be reached for comment" : "is guilty and everyone knows it",
	"debate"                           : "dance-off",
	"self driving"                     : "uncontrollably swerving",
	"self-driving"                     : "uncontrollably swerving",
	"poll"                             : "psychic reading",
	"candidate"                        : "airbender",
	"drone"                            : "dog",
	"vows to"                          : "probably won't",
	"at large"                         : "very large",
	"successfully"                     : "suddenly",
	"expands"                          : "physically expands",
	"first degree"                     : "fucking awful",
	"first-degree"                     : "fucking awful",
	"second degree"                    : "friggin' awful",
	"second-degree"                    : "friggin' awful",
	"third degree"                     : "freaking awful",
	"third-degree"                     : "freaking awful",
	"an unknown number"                : "like hundreds",
	"front runner"                     : "blade runner",
	"global"                           : "spherical",
	"years"                            : "minutes",
	"minutes"                          : "years",
	"no indication"                    : "lots of signs",
	"urged restraint by"               : "drunkenly egged on",
	"horsepower"                       : "tons of horsemeat",
	"gaffe"                            : "magic spell",
	"ancient"                          : "haunted",
	"star-studded"                     : "blood-soaked",
	"remains to be seen"               : "will never be known",
	"silver bullet"                    : "way to kill werewolves",
	"subway system"                    : "tunnels I found",
	"surprising"                       : "surprising (but not to me)",
	"war of words"                     : "interplanetary war",
	"tension"                          : "sexual tension",
	"cautiously optimistic"            : "delusional",
	"Doctor Who"                       : "The Big Bang Theory",
	"win votes"                        : "find Pokémon",
	"behind the headlines"             : "beyond the grave",
	"email"                            : "poem",
  "facebook post"                    : "poem",
	"tweet"                            : "poem",
	"Facebook CEO"                     : "this guy",
	"latest"                           : "final",
	"disrupt"                          : "destroy",
	"meeting"                          : "Ménage à trois",
	"scientists"                       : "Channing Tatum and his friends",
	"You won't believe"                : "I'm really sad about",
  "batman"                           : "a man dressed like a bat",
  "force"                            : "horse",
  "my cat"                           : "my friend Catherine",
  "would be a good name for a band"  : "dot tumblr dot com",
  "definetly"                        : "almost definitely",
  "definately"                       : "probably",
  "definatly"                        : "probably not",
  "defenitely"                       : "not telling (it's a surprise)",
  "defintely"                        : "per the prophecy",
  "definetely"                       : "definitely, maybe",
  "definantly"                       : "to be decided by coin toss",
  "defanitely"                       : "In one universe out of 14 million",
  "defineatly"                       : "Only the gods know",
  "definitly"                        : "unless someone cute shows up",
  "definitely"                       : "definitively",
  "definitively"                     : "definitely",
};

const MATCH_WHOLE_WORD = true;

chrome.runtime.onInstalled.addListener((details) => {
  if(details.reason !== "install" && details.reason !== "update") return;
  
  chrome.storage.local.set({'replacements': REPLACEMENTS});
  chrome.storage.local.set({'matchWholeWord': MATCH_WHOLE_WORD});
  
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.greeting === 'getMatchWholeWord') {
    chrome.storage.local.get(['matchWholeWord'], (response) => {
      sendResponse(response.matchWholeWord);
      return true;
    });
    return true;
  } 
  if (message.greeting === 'setMatchWholeWord') {
    chrome.storage.local.set({'matchWholeWord': message.matchWholeWord});
    return true;
  }
  if (message.greeting === "getReplacements") {
    chrome.storage.local.get(['replacements'], (response) => {
      sendResponse(response.replacements);
      return true;
    });
    return true;
  }
  if (message.greeting === "setReplacements") {
    chrome.storage.local.set({"replacements": message.replacements}, () => {
      return true;
    });
    return true;
  }
});