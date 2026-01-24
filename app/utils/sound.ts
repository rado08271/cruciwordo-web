import { type SoundConfig } from "@excaliburjs/plugin-jsfxr";

type SoundKeys = "click" | "success"

const sounds: Record<SoundKeys, SoundConfig> = {
    "click": {
        "oldParams": true,
        "wave_type": 1,
        "p_env_attack": 0.105,
        "p_env_sustain": 0.072,
        "p_env_punch": 0.32,
        "p_env_decay": 0.146,
        "p_base_freq": 0.344,
        "p_freq_limit": 0.041,
        "p_freq_ramp": -0.054,
        "p_freq_dramp": 0.213,
        "p_vib_strength": 0.131,
        "p_vib_speed": 0.072,
        "p_arp_mod": 0.393,
        "p_arp_speed": 0.6568432687047339,
        "p_duty": 0,
        "p_duty_ramp": 0,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0,
        "p_hpf_ramp": 0,
        "sound_vol": 0.10,
        "sample_rate": 44100,
        "sample_size": 8
    },
    "success": {
        "oldParams": true,
        "wave_type": 0,
        "p_env_attack": 0,
        "p_env_sustain": 0.15676648497107096,
        "p_env_punch": 0,
        "p_env_decay": 0.22998488183256993,
        "p_base_freq": 0.38446411801035424,
        "p_freq_limit": 0,
        "p_freq_ramp": 0.21175844181355116,
        "p_freq_dramp": 0,
        "p_vib_strength": 0,
        "p_vib_speed": 0,
        "p_arp_mod": 0,
        "p_arp_speed": 0,
        "p_duty": 0.029333686584797868,
        "p_duty_ramp": 0,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0,
        "p_lpf_freq": 0.9135067764877033,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0.1399912239469387,
        "p_hpf_ramp": 0,
        "sound_vol": 0.10,
        "sample_rate": 44100,
        "sample_size": 8
    }
}

export default sounds

export {
    type SoundKeys
}