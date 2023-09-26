import type { StageId } from './stages'

export type GlobalAttack = {
  targets: { stageId: StageId }[]
  description: string
}

type GlobalAttackScenario = { name: string; description: string; attacks: GlobalAttack[] }

export const GLOBAL_ATTACK_SCENARIOS: GlobalAttackScenario[] = [
  {
    name: `Unerwarteter Hackerangriff`,
    description: `Das Rechenzentrum ist von einem groß angelegten Hackerangriff betroffen. Auf dem zentralen Produktionsserver wurde schon eine potenzielle Sicherheitslücke identifiziert, über die sich die Hacker Zugang verschafft haben. Noch ist der Schaden übersehbar, aber es ist nicht abzusehen, worauf es die Angreifer genau abgesehen haben. So oder so, ihr müsst schnell handeln!`,
    attacks: [
      {
        targets: [{ stageId: 'datacenter' }, { stageId: 'production' }],
        description: `Den Hackern ist es gelungen, ins Netzwerk einzudringen, sensible Zugangsdaten zu stehlen und den zentralen Produktionsserver zu blockieren. Schützt ein Rechenzentrum eurer Wahl und die dazugehörige Produktion!`,
      },
      {
        targets: [{ stageId: 'production' }, { stageId: 'supply' }],
        description: `Die Hacker haben eine Malware eingeschleust, die die Systeme in der Produktion deutlich verlangsamt. Auch die Mitarbeitenden in der Beschaffung können derzeit nicht auf die Cloud zugreifen. Schützt eine weitere Produktion eurer Wahl und eine Beschaffung!`,
      },
      {
        targets: [{ stageId: 'logistics' }, { stageId: 'sales' }],
        description: `Die Angreifer haben die Logistik-Website gehackt und eine Hintertür eingebaut. Bis die Sicherheitslücke geschlossen ist, wird es zu Lieferverzögerungen entlang der gesamten Kette kommen. Schützt eine Logistik eurer Wahl und einen Händler!`,
      },
      {
        targets: [{ stageId: 'sales' }, { stageId: 'datacenter' }],
        description: `Ein Ransomware-Angriff auf das System eures Zahlungsabwicklers führt dazu, dass eure Vertriebspartner keine Produkte bestellen und Zahlungen tätigen können. Schützt einen weiteren Händler eurer Wahl und das dazugehörige Rechenzentrum!`,
      },
    ],
  },
  {
    name: 'Cyberangriff auf Kunden und Warenwirtschaft',
    description: `Euer Unternehmen ist das Ziel eines Angriffs auf die Datenschutzsysteme geworden. Die Cyber-Terroristen haben es geschafft, in euer zentrales Datenspeichersystem einzudringen und an die personenbezogenen Daten von Kunden und Mitarbeitern zu kommen. Ihr seid euch bewusst, dass ihr aufgrund des Angriffs möglicherweise gegen Datenschutzgesetze verstoßen habt. Schließt das Leck schnellstmöglich, um hohe Geldbußen und rechtliche Konsequenzen zu vermeiden!`,
    attacks: [
      {
        targets: [{ stageId: 'datacenter' }, { stageId: 'sales' }],
        description: `Sichert die Daten, untersucht den Angriff und informiert eure Geschäftspartner über den Vorfall. Schützt ein Rechenzentrum eurer Wahl und den dazugehörigen Händler!`,
      },
      {
        targets: [{ stageId: 'logistics' }, { stageId: 'storage' }],
        description: `Die Cyber-Terroristen haben weitere sensible Daten aus eurem System gestohlen und setzen diese für Angriffe gegen eure Lagerlogistik ein. Schützt eine Logistik eurer Wahl und die dazugehörige Lagerung!`,
      },
      {
        targets: [{ stageId: 'supply' }, { stageId: 'logistics' }],
        description: `Die Cyber-Terroristen haben sich nun auch Zugang zum Warenwirtschaftssystem verschafft und sorgen für Chaos in der Beschaffung und Logistik. Schützt eine Beschaffung eurer Wahl und eine Logistik!`,
      },
      {
        targets: [{ stageId: 'datacenter' }, { stageId: 'datacenter' }],
        description: `Es stellt sich heraus, dass die ersten Angriffe nur Ablenkungsmanöver waren. Die konzertierte Cyberattacke zielte letztendlich darauf ab, eure gesamte IT lahmzulegen. Schützt die anderen beiden Rechenzentren!`,
      },
    ],
  },
  {
    name: 'Probleme in Transport und Logistik',
    description: `Die Produktionsmethode eurer Firma ist stark nachfrage-orientiert. Ihr bestellt Materialien und Bauteile von verschiedenen Lieferanten und beginnt just-in-time mit der Produktion. Ein plötzlicher massiver Angriff auf mehrere Transport- und Logistikunternehmen stört eure Lieferkette. Ihr lauft Gefahr, die Nachfrage eurer Kunden nicht mehr bedienen zu können, was zu einem heftigen Verlust von Geschäft und Partnern führen könnte.`,
    attacks: [
      {
        targets: [{ stageId: 'supply' }, { stageId: 'storage' }],
        description: `Einige Lieferungen kommen verspätet an, die ersten gar nicht. Reklamationen häufen sich. Schützt eine Beschaffung eurer Wahl und eine Lagerung!`,
      },
      {
        targets: [{ stageId: 'logistics' }, { stageId: 'production' }],
        description: `Wenige Tage später wird der Angriff auf weitere Zulieferer ausgeweitet. Ihr bekommt die dringend benötigten Bauteile gar nicht mehr und müsst die Produktion stoppen. Schützt eine Logistik eurer Wahl und eine Produktion!`,
      },
      {
        targets: [{ stageId: 'sales' }, { stageId: 'logistics' }],
        description: `Bei euren Vertriebspartnern kommen seit Wochen keine Waren an und die ersten drohen mit Vertragsstrafen. Schützt einen Händler eurer Wahl und die dazugehörige Logistik!`,
      },
      {
        targets: [{ stageId: 'logistics' }, { stageId: 'supply' }],
        description: `Um die Probleme endgültig in den Griff zu bekommen und den Schaden zu minimieren, müsst ihr alternative Lieferquellen erschließen und eure Logistik- und Transportprozesse diversifizieren. Schützt die dritte Logistik und eine weitere Beschaffung eurer Wahl!`,
      },
    ],
  },
]
