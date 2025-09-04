// RISC-V integer register names
export const registerNames = [
  'zero',
  'ra',
  'sp',
  'gp',
  'tp',
  't0',
  't1',
  't2',
  's0/fp',
  's1',
  'a0',
  'a1',
  'a2',
  'a3',
  'a4',
  'a5',
  'a6',
  'a7',
  's2',
  's3',
  's4',
  's5',
  's6',
  's7',
  's8',
  's9',
  's10',
  's11',
  't3',
  't4',
  't5',
  't6',
]

// RISC-V floating-point register names
export const fRegisterNames = [
  'ft0',
  'ft1',
  'ft2',
  'ft3',
  'ft4',
  'ft5',
  'ft6',
  'ft7',
  'fs0',
  'fs1',
  'fa0',
  'fa1',
  'fa2',
  'fa3',
  'fa4',
  'fa5',
  'fa6',
  'fa7',
  'fs2',
  'fs3',
  'fs4',
  'fs5',
  'fs6',
  'fs7',
  'fs8',
  'fs9',
  'fs10',
  'fs11',
  'ft8',
  'ft9',
  'ft10',
  'ft11',
]

export const csrNames: Map<bigint, string> = new Map([
  // Unprivileged Floating-Point CSRs
  [0x001n, 'fflags'],
  [0x002n, 'frm'],
  [0x003n, 'fcsr'],

  // Unprivileged Vector CSRs
  [0x008n, 'vstart'],
  [0x009n, 'vxsat'],
  [0x00an, 'vxrm'],
  [0x00fn, 'vcsr'],
  [0xc20n, 'vl'],
  [0xc21n, 'vtype'],
  [0xc22n, 'vlenb'],

  // Unprivileged Zicfiss extension CSR
  [0x011n, 'ssp'],

  // Unprivileged Entropy Source Extension CSR
  [0x015n, 'seed'],

  // Unprivileged Zcmt Extension CSR
  [0x017n, 'jvt'],

  // Unprivileged Counters/Timers
  [0xc00n, 'cycle'],
  [0xc01n, 'time'],
  [0xc02n, 'instret'],
  [0xc03n, 'hpmcounter3'],
  [0xc04n, 'hpmcounter4'],
  [0xc05n, 'hpmcounter5'],
  [0xc06n, 'hpmcounter6'],
  [0xc07n, 'hpmcounter7'],
  [0xc08n, 'hpmcounter8'],
  [0xc09n, 'hpmcounter9'],
  [0xc0an, 'hpmcounter10'],
  [0xc0bn, 'hpmcounter11'],
  [0xc0cn, 'hpmcounter12'],
  [0xc0dn, 'hpmcounter13'],
  [0xc0en, 'hpmcounter14'],
  [0xc0fn, 'hpmcounter15'],
  [0xc10n, 'hpmcounter16'],
  [0xc11n, 'hpmcounter17'],
  [0xc12n, 'hpmcounter18'],
  [0xc13n, 'hpmcounter19'],
  [0xc14n, 'hpmcounter20'],
  [0xc15n, 'hpmcounter21'],
  [0xc16n, 'hpmcounter22'],
  [0xc17n, 'hpmcounter23'],
  [0xc18n, 'hpmcounter24'],
  [0xc19n, 'hpmcounter25'],
  [0xc1an, 'hpmcounter26'],
  [0xc1bn, 'hpmcounter27'],
  [0xc1cn, 'hpmcounter28'],
  [0xc1dn, 'hpmcounter29'],
  [0xc1en, 'hpmcounter30'],
  [0xc1fn, 'hpmcounter31'],

  // Upper 32 bits of counters (RV32 only)
  [0xc80n, 'cycleh'],
  [0xc81n, 'timeh'],
  [0xc82n, 'instreth'],
  [0xc83n, 'hpmcounter3h'],
  [0xc84n, 'hpmcounter4h'],
  [0xc85n, 'hpmcounter5h'],
  [0xc86n, 'hpmcounter6h'],
  [0xc87n, 'hpmcounter7h'],
  [0xc88n, 'hpmcounter8h'],
  [0xc89n, 'hpmcounter9h'],
  [0xc8an, 'hpmcounter10h'],
  [0xc8bn, 'hpmcounter11h'],
  [0xc8cn, 'hpmcounter12h'],
  [0xc8dn, 'hpmcounter13h'],
  [0xc8en, 'hpmcounter14h'],
  [0xc8fn, 'hpmcounter15h'],
  [0xc90n, 'hpmcounter16h'],
  [0xc91n, 'hpmcounter17h'],
  [0xc92n, 'hpmcounter18h'],
  [0xc93n, 'hpmcounter19h'],
  [0xc94n, 'hpmcounter20h'],
  [0xc95n, 'hpmcounter21h'],
  [0xc96n, 'hpmcounter22h'],
  [0xc97n, 'hpmcounter23h'],
  [0xc98n, 'hpmcounter24h'],
  [0xc99n, 'hpmcounter25h'],
  [0xc9an, 'hpmcounter26h'],
  [0xc9bn, 'hpmcounter27h'],
  [0xc9cn, 'hpmcounter28h'],
  [0xc9dn, 'hpmcounter29h'],
  [0xc9en, 'hpmcounter30h'],
  [0xc9fn, 'hpmcounter31h'],

  // Supervisor Trap Setup
  [0x100n, 'sstatus'],
  [0x104n, 'sie'],
  [0x105n, 'stvec'],
  [0x106n, 'scounteren'],

  // Supervisor Configuration
  [0x10an, 'senvcfg'],

  // Supervisor Counter Setup
  [0x120n, 'scountinhibit'],

  // Supervisor Trap Handling
  [0x140n, 'sscratch'],
  [0x141n, 'sepc'],
  [0x142n, 'scause'],
  [0x143n, 'stval'],
  [0x144n, 'sip'],
  [0xda0n, 'scountovf'],

  // Supervisor Indirect
  [0x150n, 'siselect'],
  [0x151n, 'sireg'],
  [0x152n, 'sireg2'],
  [0x153n, 'sireg3'],
  [0x155n, 'sireg4'],
  [0x156n, 'sireg5'],
  [0x157n, 'sireg6'],

  // Supervisor Protection and Translation
  [0x180n, 'satp'],

  // Supervisor Timer Compare
  [0x14dn, 'stimecmp'],
  [0x15dn, 'stimecmph'], // RV32 high part of stimecmp

  // Debug/Trace Registers
  [0x5a8n, 'scontext'],

  // Supervisor Resource Management Configuration
  [0x181n, 'srmcfg'],

  // Supervisor State Enable Registers
  [0x10cn, 'sstateen0'],
  [0x10dn, 'sstateen1'],
  [0x10en, 'sstateen2'],
  [0x10fn, 'sstateen3'],

  // Supervisor Control Transfer Records Configuration
  [0x14en, 'sctrctl'],
  [0x14fn, 'sctrstatus'],
  [0x15fn, 'sctrdepth'],

  // Hypervisor Trap Setup
  [0x600n, 'hstatus'],
  [0x602n, 'hedeleg'],
  [0x603n, 'hideleg'],
  [0x604n, 'hie'],
  [0x606n, 'hcounteren'],
  [0x607n, 'hgeie'],

  // Hypervisor Trap Handling
  [0x643n, 'htval'],
  [0x644n, 'hip'],
  [0x645n, 'hvip'],
  [0x64an, 'htinst'],
  [0xe12n, 'hgeip'],

  // Hypervisor Configuration
  [0x60an, 'henvcfg'],
  [0x61an, 'henvcfgh'], // RV32 high part of henvcfg

  // Hypervisor Protection and Translation
  [0x680n, 'hgatp'],

  // Debug/Trace Registers (Hypervisor)
  [0x6a8n, 'hcontext'],

  // Hypervisor State Enable Registers
  [0x60cn, 'hstateen0'],
  [0x60dn, 'hstateen1'],
  [0x60en, 'hstateen2'],
  [0x60fn, 'hstateen3'],
  [0x61cn, 'hstateen0h'], // RV32 high part of hstateen0
  [0x61dn, 'hstateen1h'], // RV32 high part of hstateen1
  [0x61en, 'hstateen2h'], // RV32 high part of hstateen2
  [0x61fn, 'hstateen3h'], // RV32 high part of hstateen3

  // Virtual Supervisor CSRs
  [0x200n, 'vsstatus'],
  [0x204n, 'vsie'],
  [0x205n, 'vstvec'],
  [0x240n, 'vsscratch'],
  [0x241n, 'vsepc'],
  [0x242n, 'vscause'],
  [0x243n, 'vstval'],
  [0x244n, 'vsip'],
  [0x280n, 'vsatp'],

  // Virtual Supervisor Indirect
  [0x250n, 'vsiselect'],
  [0x251n, 'vsireg'],
  [0x252n, 'vsireg2'],
  [0x253n, 'vsireg3'],
  [0x255n, 'vsireg4'],
  [0x256n, 'vsireg5'],
  [0x257n, 'vsireg6'],

  // Virtual Supervisor Timer Compare
  [0x24dn, 'vstimecmp'],
  [0x25dn, 'vstimecmph'], // RV32 high part of vstimecmp

  // Virtual Supervisor Control Transfer Records Configuration
  [0x24en, 'vsctrctl'],

  // Machine Information Registers
  [0xf11n, 'mvendorid'],
  [0xf12n, 'marchid'],
  [0xf13n, 'mimpid'],
  [0xf14n, 'mhartid'],
  [0xf15n, 'mconfigptr'],

  // Machine Trap Setup
  [0x300n, 'mstatus'],
  [0x301n, 'misa'],
  [0x302n, 'medeleg'],
  [0x303n, 'mideleg'],
  [0x304n, 'mie'],
  [0x305n, 'mtvec'],
  [0x306n, 'mcounteren'],
  [0x310n, 'mstatush'], // RV32 high part of mstatus
  [0x312n, 'medelegh'], // RV32 high part of medeleg

  // Machine Counter Configuration
  [0x321n, 'mcyclecfg'],
  [0x322n, 'minstretcfg'],
  [0x721n, 'mcyclecfgh'], // RV32 high part of mcyclecfg
  [0x722n, 'minstretcfgh'], // RV32 high part of minstretcfg

  // Machine Trap Handling
  [0x340n, 'mscratch'],
  [0x341n, 'mepc'],
  [0x342n, 'mcause'],
  [0x343n, 'mtval'],
  [0x344n, 'mip'],
  [0x34an, 'mtinst'],
  [0x34bn, 'mtval2'],

  // Machine Indirect CSR Access
  [0x350n, 'miselect'],
  [0x351n, 'mireg'],
  [0x352n, 'mireg2'],
  [0x353n, 'mireg3'],
  [0x355n, 'mireg4'],
  [0x356n, 'mireg5'],
  [0x357n, 'mireg6'],

  // Machine Configuration
  [0x30an, 'menvcfg'],
  [0x31an, 'menvcfgh'], // RV32 high part of menvcfg
  [0x747n, 'mseccfg'],
  [0x757n, 'mseccfgh'], // RV32 high part of mseccfg

  // Machine Memory Protection
  [0x3a0n, 'pmpcfg0'],
  [0x3a1n, 'pmpcfg1'],
  [0x3a2n, 'pmpcfg2'],
  [0x3a3n, 'pmpcfg3'],
  [0x3a4n, 'pmpcfg4'],
  [0x3a5n, 'pmpcfg5'],
  [0x3a6n, 'pmpcfg6'],
  [0x3a7n, 'pmpcfg7'],
  [0x3a8n, 'pmpcfg8'],
  [0x3a9n, 'pmpcfg9'],
  [0x3aan, 'pmpcfg10'],
  [0x3abn, 'pmpcfg11'],
  [0x3acn, 'pmpcfg12'],
  [0x3adn, 'pmpcfg13'],
  [0x3aen, 'pmpcfg14'],
  [0x3afn, 'pmpcfg15'],

  // PMP Address registers
  [0x3b0n, 'pmpaddr0'],
  [0x3b1n, 'pmpaddr1'],
  [0x3b2n, 'pmpaddr2'],
  [0x3b3n, 'pmpaddr3'],
  [0x3b4n, 'pmpaddr4'],
  [0x3b5n, 'pmpaddr5'],
  [0x3b6n, 'pmpaddr6'],
  [0x3b7n, 'pmpaddr7'],
  [0x3b8n, 'pmpaddr8'],
  [0x3b9n, 'pmpaddr9'],
  [0x3ban, 'pmpaddr10'],
  [0x3bbn, 'pmpaddr11'],
  [0x3bcn, 'pmpaddr12'],
  [0x3bdn, 'pmpaddr13'],
  [0x3ben, 'pmpaddr14'],
  [0x3bfn, 'pmpaddr15'],
  [0x3c0n, 'pmpaddr16'],
  [0x3c1n, 'pmpaddr17'],
  [0x3c2n, 'pmpaddr18'],
  [0x3c3n, 'pmpaddr19'],
  [0x3c4n, 'pmpaddr20'],
  [0x3c5n, 'pmpaddr21'],
  [0x3c6n, 'pmpaddr22'],
  [0x3c7n, 'pmpaddr23'],
  [0x3c8n, 'pmpaddr24'],
  [0x3c9n, 'pmpaddr25'],
  [0x3can, 'pmpaddr26'],
  [0x3cbn, 'pmpaddr27'],
  [0x3ccn, 'pmpaddr28'],
  [0x3cdn, 'pmpaddr29'],
  [0x3cen, 'pmpaddr30'],
  [0x3cfn, 'pmpaddr31'],
  [0x3d0n, 'pmpaddr32'],
  [0x3d1n, 'pmpaddr33'],
  [0x3d2n, 'pmpaddr34'],
  [0x3d3n, 'pmpaddr35'],
  [0x3d4n, 'pmpaddr36'],
  [0x3d5n, 'pmpaddr37'],
  [0x3d6n, 'pmpaddr38'],
  [0x3d7n, 'pmpaddr39'],
  [0x3d8n, 'pmpaddr40'],
  [0x3d9n, 'pmpaddr41'],
  [0x3dan, 'pmpaddr42'],
  [0x3dbn, 'pmpaddr43'],
  [0x3dcn, 'pmpaddr44'],
  [0x3ddn, 'pmpaddr45'],
  [0x3den, 'pmpaddr46'],
  [0x3dfn, 'pmpaddr47'],
  [0x3e0n, 'pmpaddr48'],
  [0x3e1n, 'pmpaddr49'],
  [0x3e2n, 'pmpaddr50'],
  [0x3e3n, 'pmpaddr51'],
  [0x3e4n, 'pmpaddr52'],
  [0x3e5n, 'pmpaddr53'],
  [0x3e6n, 'pmpaddr54'],
  [0x3e7n, 'pmpaddr55'],
  [0x3e8n, 'pmpaddr56'],
  [0x3e9n, 'pmpaddr57'],
  [0x3ean, 'pmpaddr58'],
  [0x3ebn, 'pmpaddr59'],
  [0x3ecn, 'pmpaddr60'],
  [0x3edn, 'pmpaddr61'],
  [0x3een, 'pmpaddr62'],
  [0x3efn, 'pmpaddr63'],

  // Machine State Enable Registers
  [0x30cn, 'mstateen0'],
  [0x30dn, 'mstateen1'],
  [0x30en, 'mstateen2'],
  [0x30fn, 'mstateen3'],
  [0x31cn, 'mstateen0h'], // RV32 high part of mstateen0
  [0x31dn, 'mstateen1h'], // RV32 high part of mstateen1
  [0x31en, 'mstateen2h'], // RV32 high part of mstateen2
  [0x31fn, 'mstateen3h'], // RV32 high part of mstateen3

  // Machine Non-Maskable Interrupt Handling
  [0x740n, 'mnscratch'],
  [0x741n, 'mnepc'],
  [0x742n, 'mncause'],
  [0x744n, 'mnstatus'],

  // Machine Counters/Timers
  [0xb00n, 'mcycle'],
  [0xb02n, 'minstret'],
  [0xb03n, 'mhpmcounter3'],
  [0xb04n, 'mhpmcounter4'],
  [0xb05n, 'mhpmcounter5'],
  [0xb06n, 'mhpmcounter6'],
  [0xb07n, 'mhpmcounter7'],
  [0xb08n, 'mhpmcounter8'],
  [0xb09n, 'mhpmcounter9'],
  [0xb0an, 'mhpmcounter10'],
  [0xb0bn, 'mhpmcounter11'],
  [0xb0cn, 'mhpmcounter12'],
  [0xb0dn, 'mhpmcounter13'],
  [0xb0en, 'mhpmcounter14'],
  [0xb0fn, 'mhpmcounter15'],
  [0xb10n, 'mhpmcounter16'],
  [0xb11n, 'mhpmcounter17'],
  [0xb12n, 'mhpmcounter18'],
  [0xb13n, 'mhpmcounter19'],
  [0xb14n, 'mhpmcounter20'],
  [0xb15n, 'mhpmcounter21'],
  [0xb16n, 'mhpmcounter22'],
  [0xb17n, 'mhpmcounter23'],
  [0xb18n, 'mhpmcounter24'],
  [0xb19n, 'mhpmcounter25'],
  [0xb1an, 'mhpmcounter26'],
  [0xb1bn, 'mhpmcounter27'],
  [0xb1cn, 'mhpmcounter28'],
  [0xb1dn, 'mhpmcounter29'],
  [0xb1en, 'mhpmcounter30'],
  [0xb1fn, 'mhpmcounter31'],

  // Upper 32 bits of machine counters (RV32 only)
  [0xb80n, 'mcycleh'],
  [0xb82n, 'minstreth'],
  [0xb83n, 'mhpmcounter3h'],
  [0xb84n, 'mhpmcounter4h'],
  [0xb85n, 'mhpmcounter5h'],
  [0xb86n, 'mhpmcounter6h'],
  [0xb87n, 'mhpmcounter7h'],
  [0xb88n, 'mhpmcounter8h'],
  [0xb89n, 'mhpmcounter9h'],
  [0xb8an, 'mhpmcounter10h'],
  [0xb8bn, 'mhpmcounter11h'],
  [0xb8cn, 'mhpmcounter12h'],
  [0xb8dn, 'mhpmcounter13h'],
  [0xb8en, 'mhpmcounter14h'],
  [0xb8fn, 'mhpmcounter15h'],
  [0xb90n, 'mhpmcounter16h'],
  [0xb91n, 'mhpmcounter17h'],
  [0xb92n, 'mhpmcounter18h'],
  [0xb93n, 'mhpmcounter19h'],
  [0xb94n, 'mhpmcounter20h'],
  [0xb95n, 'mhpmcounter21h'],
  [0xb96n, 'mhpmcounter22h'],
  [0xb97n, 'mhpmcounter23h'],
  [0xb98n, 'mhpmcounter24h'],
  [0xb99n, 'mhpmcounter25h'],
  [0xb9an, 'mhpmcounter26h'],
  [0xb9bn, 'mhpmcounter27h'],
  [0xb9cn, 'mhpmcounter28h'],
  [0xb9dn, 'mhpmcounter29h'],
  [0xb9en, 'mhpmcounter30h'],
  [0xb9fn, 'mhpmcounter31h'],

  // Machine Counter Setup
  [0x320n, 'mcountinhibit'],
  [0x323n, 'mhpmevent3'],
  [0x324n, 'mhpmevent4'],
  [0x325n, 'mhpmevent5'],
  [0x326n, 'mhpmevent6'],
  [0x327n, 'mhpmevent7'],
  [0x328n, 'mhpmevent8'],
  [0x329n, 'mhpmevent9'],
  [0x32an, 'mhpmevent10'],
  [0x32bn, 'mhpmevent11'],
  [0x32cn, 'mhpmevent12'],
  [0x32dn, 'mhpmevent13'],
  [0x32en, 'mhpmevent14'],
  [0x32fn, 'mhpmevent15'],
  [0x330n, 'mhpmevent16'],
  [0x331n, 'mhpmevent17'],
  [0x332n, 'mhpmevent18'],
  [0x333n, 'mhpmevent19'],
  [0x334n, 'mhpmevent20'],
  [0x335n, 'mhpmevent21'],
  [0x336n, 'mhpmevent22'],
  [0x337n, 'mhpmevent23'],
  [0x338n, 'mhpmevent24'],
  [0x339n, 'mhpmevent25'],
  [0x33an, 'mhpmevent26'],
  [0x33bn, 'mhpmevent27'],
  [0x33cn, 'mhpmevent28'],
  [0x33dn, 'mhpmevent29'],
  [0x33en, 'mhpmevent30'],
  [0x33fn, 'mhpmevent31'],

  // Upper 32 bits of machine event selectors (RV32 only)
  [0x723n, 'mhpmevent3h'],
  [0x724n, 'mhpmevent4h'],
  [0x725n, 'mhpmevent5h'],
  [0x726n, 'mhpmevent6h'],
  [0x727n, 'mhpmevent7h'],
  [0x728n, 'mhpmevent8h'],
  [0x729n, 'mhpmevent9h'],
  [0x72an, 'mhpmevent10h'],
  [0x72bn, 'mhpmevent11h'],
  [0x72cn, 'mhpmevent12h'],
  [0x72dn, 'mhpmevent13h'],
  [0x72en, 'mhpmevent14h'],
  [0x72fn, 'mhpmevent15h'],
  [0x730n, 'mhpmevent16h'],
  [0x731n, 'mhpmevent17h'],
  [0x732n, 'mhpmevent18h'],
  [0x733n, 'mhpmevent19h'],
  [0x734n, 'mhpmevent20h'],
  [0x735n, 'mhpmevent21h'],
  [0x736n, 'mhpmevent22h'],
  [0x737n, 'mhpmevent23h'],
  [0x738n, 'mhpmevent24h'],
  [0x739n, 'mhpmevent25h'],
  [0x73an, 'mhpmevent26h'],
  [0x73bn, 'mhpmevent27h'],
  [0x73cn, 'mhpmevent28h'],
  [0x73dn, 'mhpmevent29h'],
  [0x73en, 'mhpmevent30h'],
  [0x73fn, 'mhpmevent31h'],

  // Machine Control Transfer Records Configuration
  [0x34en, 'mctrctl'],

  // Debug/Trace Registers
  [0x7a0n, 'tselect'],
  [0x7a1n, 'tdata1'],
  [0x7a2n, 'tdata2'],
  [0x7a3n, 'tdata3'],
  [0x7a8n, 'mcontext'],

  // Debug Mode Registers
  [0x7b0n, 'dcsr'],
  [0x7b1n, 'dpc'],
  [0x7b2n, 'dscratch0'],
  [0x7b3n, 'dscratch1'],
])
