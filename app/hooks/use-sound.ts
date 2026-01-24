import {JsfxrResource} from "@excaliburjs/plugin-jsfxr";
import sounds, {type SoundKeys} from "~/utils/sound";
import {useMemo} from "react";

const useSound = (sound: SoundKeys) => {
    const soundPlugin = useMemo(() => {
        const plugin = new JsfxrResource();

        plugin.init(); //initializes the JSFXR library
        for (const [sound, config] of Object.entries(sounds)) {
            plugin.loadSoundConfig(sound, config);
        }

        return plugin
    }, [])

    const playSound = () => {
        soundPlugin.playSound(sound)
    }


    return playSound
}

export default useSound